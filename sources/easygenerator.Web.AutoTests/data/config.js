'use strict';

const SERVER_NAME = (process.env.SERVER_NAME || 'localhost/SQLEXPRESS').replace(/[\/]/g, '\\');
const PORT = process.env.SERVER_PORT || 1433;
const DB_DATA_PATH = (process.env.DB_DATA_PATH || 'C:/Program Files/Microsoft SQL Server/MSSQL12.SQLEXPRESS/MSSQL/DATA/').replace(/[\/]/g, '\\');
const DB_LOG_PATH = (process.env.DB_LOG_PATH || 'C:/Program Files/Microsoft SQL Server/MSSQL12.SQLEXPRESS/MSSQL/DATA/').replace(/[\/]/g, '\\');
const USERNAME = process.env.DB_USERNAME || 'easygenerator';
const PASSWORD = process.env.DB_PASSWORD || 'abcABC123';

module.exports = {
    app: {
        db: {
            server: SERVER_NAME,
            port: PORT,
            database: 'autotests.easygenerator.com',
            user: USERNAME,
            password: PASSWORD
        },
        backupPath: './backups/autotests.easygenerator.com.bak',
        dbDataPath: DB_DATA_PATH,
        dbLogPath: DB_LOG_PATH
    },
    storage: {
        db: {
            server: SERVER_NAME,
            port: PORT,
            database: 'storage-autotests.easygenerator.com',
            user: USERNAME,
            password: PASSWORD
        },
        backupPath: './backups/storage-autotests.easygenerator.com.bak',
        dbDataPath: DB_DATA_PATH,
        dbLogPath: DB_LOG_PATH
    },
    publication: {
        db: {
            server: SERVER_NAME,
            port: PORT,
            database: 'elearning-autotests.easygenerator.com',
            user: USERNAME,
            password: PASSWORD
        },
        backupPath: './backups/elearning-autotests.easygenerator.com.bak',
        dbDataPath: DB_DATA_PATH,
        dbLogPath: DB_LOG_PATH,
        fileStorage: {
            backupPath: './backups/courses.zip',
            destPath: '../../easygenerator.PublicationServer.Web/courses'
        }
    }
}