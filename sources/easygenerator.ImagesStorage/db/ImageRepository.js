'use strict';

var mssql = require('mssql');
var DataContext = require('./index');
var Image = require('../models/Image');

var _instance = null;

class ImageRepository {
    constructor() {
        if (_instance === null) {
            _instance = this;
        }
        return _instance;
    }
    *getImagesByEmail(email) {
        let connection = yield DataContext.connect();
        let request = new mssql.Request(connection);
        request.input('createdBy', mssql.NVarChar(255), email);
        let recordset = yield request.query('SELECT * FROM dbo.Images WHERE CreatedBy = @createdBy');
        let images = [];
        for (let record of recordset) {
            images.push(new Image(
                record.Id,
                record.Title,
                record.CreatedBy,
                record.CreatedOn,
                record.Size
            ));
        }
        connection.close();
        return images;
    }
    *getImageById(id){
        if (id) {
            let connection = yield DataContext.connect();
            let request = new mssql.Request(connection);
            request.input('id', mssql.UniqueIdentifier, id);
            let recordset = yield request.query('SELECT * FROM dbo.Images WHERE Id = @id');
            connection.close();
            if(recordset.length === 0)
                return null;
            else
                return new Image(
                    recordset[0].Id,
                    recordset[0].Title,
                    recordset[0].CreatedBy,
                    recordset[0].CreatedOn,
                    recordset[0].Size
                );
        }
        return null;
    }
    *insert(image) {
        if (image instanceof Image) {
            let connection = yield DataContext.connect();
            let request = new mssql.Request(connection);
            request.input('id', mssql.UniqueIdentifier, image.id);
            request.input('title', mssql.NVarChar(255), image.title);
            request.input('createdBy', mssql.NVarChar(255), image.createdBy);
            request.input('createdOn', mssql.DateTime, image.createdOn);
            request.input('size', mssql.Int, image.size);
            let recordset = yield request.query('INSERT INTO dbo.Images VALUES (@id, @title, @createdBy, @createdOn, @size)');
            connection.close();
        }
    }
    *remove(id) {
        if (id) {
            let connection = yield DataContext.connect();
            let request = new mssql.Request(connection);
            request.input('id', mssql.UniqueIdentifier, id);
            let recordset = yield request.query('DELETE FROM dbo.Images WHERE Id = @id');
            connection.close();
        }
    }
}

module.exports = ImageRepository;