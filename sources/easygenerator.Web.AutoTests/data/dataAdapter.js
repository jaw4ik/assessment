'use strict';

var path = require('path');
var sql = require('mssql');
var colors = require('colors');
var del = require('del');
var exec = require('child_process').exec;

const changesTableName = 'LastChanges';
const cloneTablePrefix = 'clone_';

class DataAdapter {
    constructor(config) {
        this._throwIfNullOrEmpty(config, 'config');
        this._throwIfNullOrEmpty(config.db, 'dbConfig');
        this._throwIfNullOrEmpty(config.db.database, 'database');

        this.dbConfig = config.db;
        this.backupPath = path.resolve(__dirname, config.backupPath);
        if(config.fileStorage){
            this.fileStorage = {
                backupPath: path.resolve(__dirname, config.fileStorage.backupPath),
                destPath: path.resolve(__dirname, config.fileStorage.destPath)
            }
        }
    }

    *connect() {
        if (this.connection) {
            return;
        }
        let config = Object.assign({}, this.dbConfig);
        config.database = 'master';
        this.connection = yield sql.connect(config);
    }
    close() {
        this.connection.close();
    }
    *killAllConnections() {
        yield* this._executeQuery(
            `USE master;
            IF db_id('${this.dbConfig.database}') IS NOT NULL
            BEGIN
            ALTER DATABASE [${this.dbConfig.database}] SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
            ALTER DATABASE [${this.dbConfig.database}] SET MULTI_USER
            END`
        );
    }
    *deployFromBackups() {
        yield* this._executeQuery(
            `USE master;
            RESTORE DATABASE [${this.dbConfig.database}] FROM DISK = '${this.backupPath}'`
        );
        console.log(`Database '${this.dbConfig.database.green}' have been successfully deployed`);
        if(!this.fileStorage || !this.fileStorage.backupPath || !this.fileStorage.destPath){
            return;
        }
        yield this._extractArchive(this.fileStorage.backupPath, this.fileStorage.destPath);
        console.log(`File storage have been successfully deployed to ${this.fileStorage.destPath}`);
    }
    *updateCurrentBackups(){
        yield del([this.backupPath], { force: true });
        yield* this._executeQuery(
            `USE master;
            BACKUP DATABASE [${this.dbConfig.database}] TO DISK = '${this.backupPath}'`
        );
        console.log(`Backup for database '${this.dbConfig.database.green}' have been successfully updated`);
        if(!this.fileStorage || !this.fileStorage.backupPath || !this.fileStorage.destPath){
            return;
        }
        yield this._addToArchive(this.fileStorage.destPath, this.fileStorage.backupPath);
        console.log(`Backup for file storage have been successfully updated to ${this.fileStorage.backupPath}`);
    }
    *addIdIfNotExists() {
        const tables = yield* this._executeQuery(
            `USE [${this.dbConfig.database}];
            SELECT name FROM sys.Tables WHERE Object_ID(N''+name+'') NOT IN (SELECT Object_ID FROM sys.columns WHERE Name = N'Id')`
        );
        if (!tables || !tables.length) {
            return;
        }
        let query = `USE [${this.dbConfig.database}]`;
        for (let { name } of tables) {
            query += `ALTER TABLE ${name} ADD Id Uniqueidentifier NOT NULL DEFAULT(NEWID()) UNIQUE;`;
        }
        yield* this._executeQuery(query);
        console.log(`Id column have been successfully added to all tables in db '${this.dbConfig.database.green}'`);
    }
    *addTableToStoreChanges() {
        yield* this._executeQuery(
            `IF object_id('${changesTableName}') is null
            CREATE TABLE ${changesTableName} 
            (
                Id UniqueIdentifier NOT NULL,
                CommandName NVARCHAR(10) NOT NULL,
                TableName NVARCHAR(50) NOT NULL
            )
            DELETE FROM ${changesTableName}`);
        console.log(`Table to store changes have been successfully added to db '${this.dbConfig.database.green}'`);
    }
    *addTriggersToWatchChanges() {
        const tables = yield* this._executeQuery(
            `USE [${this.dbConfig.database}];
            SELECT name FROM sys.Tables WHERE name NOT LIKE '%${cloneTablePrefix}%' AND name <> '${changesTableName}'`
        );
        let query = `USE [${this.dbConfig.database}];`;
        for (let { name } of tables) {
            query += `IF NOT EXISTS (SELECT * FROM sys.triggers WHERE name='onchange_${name}')
                      EXEC(
                        'CREATE TRIGGER onchange_${name} ON ${name} FOR INSERT, UPDATE, DELETE As
                        DELETE FROM ${changesTableName} WHERE Id in (
                        SELECT
                        CASE WHEN INSERTED.Id IS NULL THEN DELETED.Id
							                          ELSE INSERTED.Id
                        END
                        FROM INSERTED FULL OUTER JOIN DELETED ON INSERTED.Id = DELETED.Id)
                        AND TableName = ''${name}''

                        INSERT into ${changesTableName} (Id, CommandName, TableName) 
                        SELECT
                        CASE WHEN INSERTED.Id IS NULL THEN DELETED.Id
							                         ELSE INSERTED.Id
                        END,
                        CASE WHEN INSERTED.Id IS NULL THEN ''DELETE''
	                         WHEN DELETED.Id IS NULL THEN ''INSERT''
							                         ELSE ''UPDATE''
                        END,
                        ''${name}''
                        FROM INSERTED FULL OUTER JOIN DELETED ON INSERTED.Id = DELETED.Id'
                      )`;
        }
        yield* this._executeQuery(query);
        console.log(`Watch triggers have been successfully added to db '${this.dbConfig.database.green}'`);
    }
    *cloneAllTables() {
        const tables = yield* this._executeQuery(
            `USE [${this.dbConfig.database}];
            SELECT name FROM sys.Tables`
        );
        let query = `USE [${this.dbConfig.database}];`;
        for (let { name } of tables) {
            query += `IF object_id('${cloneTablePrefix}${name}') is null
                      SELECT * INTO ${cloneTablePrefix}${name} FROM ${name};`;
        }
        yield* this._executeQuery(query);
        console.log(`All tables have been successfully cloned in db '${this.dbConfig.database.green}'`);
    }
    *resetChanges() {
        const rollbackData = yield* this._executeQuery(
            `USE [${this.dbConfig.database}];
            SELECT * FROM ${changesTableName}`
        );
        if (!rollbackData || !rollbackData.length) {
            return;
        }
        let query = `USE [${this.dbConfig.database}];`;
        for (let { Id, CommandName, TableName } of rollbackData) {
            switch (CommandName) {
                case 'INSERT':
                    {
                        query += `DELETE FROM ${TableName} WHERE Id='${Id}';`;
                        break;
                    }
                case 'UPDATE':
                    {
                        query += `DELETE FROM ${TableName} WHERE Id='${Id}';
                                  INSERT INTO ${TableName} SELECT * FROM ${cloneTablePrefix}${TableName} WHERE Id='${Id}';`;
                        break;
                    }
                case 'DELETE':
                    {
                        query += `INSERT INTO ${TableName} SELECT * FROM ${cloneTablePrefix}${TableName} WHERE Id='${Id}';`;
                        break;
                    }
                default:
                    {
                        break;
                    }
            }
        }
        query += `DELETE FROM ${changesTableName}`;
        yield* this._executeQuery(query);
        console.log(`Last changes have been successfully rolled back in db '${this.dbConfig.database.green}'`);
    }

    *_executeQuery(query) {
        yield* this.connect();
        const request = new sql.Request(this.connection);
        return yield request.query(query);
    }
    _extractArchive(source, dest){
        var command = `7z x -y -o"${dest}" "${source}"`;
        return this._execCommand(command);
    }
    _addToArchive(source, dest){
        var command = `7z a -y "${dest}" "${source}/*"`;
        return this._execCommand(command);
    }
    _execCommand(command){
        var result = exec(command);
        result.stdout.pipe(process.stdout);
        result.stderr.pipe(process.stderr);
        return new Promise(resolve => {
            result.addListener("exit", resolve);
        });
    }
    _throwIfNullOrEmpty(propValue, propName) {
        if (!propValue) {
            throw `the value of ${propName} cannot be null or empty`;
        }
    }
}

module.exports = DataAdapter;