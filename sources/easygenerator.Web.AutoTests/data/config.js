'use strict';

module.exports = {
    app: {
        db: {
            server: 'localhost\\SQLEXPRESS',
            port: 1433,
            database: 'autotests.easygenerator.com',
            user: 'easygenerator',
            password: 'abcABC123'
        },
        backupPath: './backups/autotests.easygenerator.com.bak'
    },
    storage: {
        db: {
            server: 'localhost\\SQLEXPRESS',
            port: 1433,
            database: 'storage-autotests.easygenerator.com',
            user: 'easygenerator',
            password: 'abcABC123'
        },
        backupPath: './backups/storage-autotests.easygenerator.com.bak'
    },
    publication: {
        db: {
            server: 'localhost\\SQLEXPRESS',
            port: 1433,
            database: 'elearning-autotests.easygenerator.com',
            user: 'easygenerator',
            password: 'abcABC123'
        },
        backupPath: './backups/elearning-autotests.easygenerator.com.bak',
        fileStorage: {
            backupPath: './backups/courses.zip',
            destPath: '../../easygenerator.PublicationServer.Web/courses'
        }
    }
}