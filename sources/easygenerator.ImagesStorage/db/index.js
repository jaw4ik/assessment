'use strict';

var config = require('./config');
var mssql = require('mssql');

class DataContext {
    static connect(connectWithoutDbName = false) {
        return new Promise((resolve, reject) => {
            let connOptions = {};
            Object.assign(connOptions, config);
            if (connectWithoutDbName) {
                connOptions.database = '';
            }
            var connection = new mssql.Connection(connOptions, err => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(connection);
            });
        })
    }
    static init() {
        return this._createDataBaseIfNotExists()
            .then(() => {
                this.connect().then(connection => {
                    let createTableRequest = new mssql.Request(connection);
                    let imagesTable = new mssql.Table('Images');
                    imagesTable.create = true;
                    imagesTable.columns.add('Id', mssql.UniqueIdentifier, {
                        nullable: false,
                        primary: true
                    });
                    imagesTable.columns.add('Title', mssql.NVarChar(255), {
                        nullable: false
                    });
                    imagesTable.columns.add('CreatedBy', mssql.NVarChar(255), {
                        nullable: false
                    });
                    imagesTable.columns.add('CreatedOn', mssql.DateTime, {
                        nullable: false
                    });
                    imagesTable.columns.add('Size', mssql.Int, {
                        nullable: false
                    });
                    return createTableRequest.bulk(imagesTable).then(() => connection.close()).catch(reason => {
                        connection.close();
                        return reason;
                    });
                });
            });
    }
    static _createDataBaseIfNotExists() {
        return this.connect(true).then(connection => new mssql.Request(connection).query(
            `IF NOT EXISTS(SELECT * FROM SYS.DATABASES WHERE name = '${config.database}') CREATE DATABASE ${config.database}`
        ).then(() => connection.close()).catch(() => connection.close()));
    }
}

module.exports = DataContext;