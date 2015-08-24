﻿'use strict';

var 
    fs = require('fs'),
    path = require('path'),

    _ = require('lodash'),
    Q = require('q'),
    express = require('express'),
    app = express(),
    cors = require('cors'),
    morgan = require('morgan'),
    Busboy = require('busboy'),
    uuid = require('node-uuid'),

    converter = require('./converter'),
    config = require('./config'),

    request = require('request')
;

app.use(cors());
app.use(morgan('dev'));

app.get(config.LOCATION + '/', function (req, res) {
    res.send('OK');
});


var tickets = [];

app.post(config.LOCATION + '/ticket', function (req, res) {
    var token = req.get('authorization') && req.get('authorization').split(' ')[1];
    if (token && (config.apps.indexOf(token) > -1)) {
        var ticket = uuid.v4();
        tickets.push(ticket);
        res.status(200).send(ticket);
        return;
    }
    res.status(401).send('401 Unauthorized');
});

function useTicket(req, res, next) {
    if (_.indexOf(tickets, req.get('ticket')) > -1) {
        _.pull(tickets, req.get('ticket'));
        next();
    } else {
        res.status(401).send('401 Unauthorized');
    }
}

app.post(config.LOCATION + '/', [useTicket], function (req, res) {
    
    var busboy = new Busboy({ headers: req.headers });
    
    var promises = [];
    busboy.on('file', function (name, file, filename) {
        if (filename.length === 0) {
            file.resume();
        } else {
            var id = uuid.v4();
            
            var directoryPath = path.join(config.TEMP_FOLDER, id);
            fs.mkdirSync(directoryPath);
            
            promises.push(converter.run(file, directoryPath)
                .then(function (metadata) {
                return {
                    id: id,
                    duration: metadata.duration
                };
            })
                .catch(function (reason) {
                file.resume();
                throw reason;
            }));
        }
    });
    
    busboy.on('finish', function () {
        Q.all(promises).then(function (files) {
            if (files.length === 0) {
                res.status(400).send('You have to provide at least 1 file');
            } else {
                res.send(files.map(function (file) {
                    return {
                        id: file.id,
                        duration: file.duration,
                        url: req.protocol + '://' + req.get('host') + req.originalUrl + '/' + file.id
                    };
                }));
            }
        })
            .catch(function (reason) {
            res.status(400).send('Unable to process file(s)');
        });
    });
    
    return req.pipe(busboy);
});

app.delete(config.LOCATION + '/:id', [useTicket], function (req, res) {
    var id = req.params.id;
    
    fs.readdir(path.join(config.TEMP_FOLDER, id), function (err, files) {
        if (err) {
            if (err.code !== "ENOENT") {
                throw err;
            } else {
                res.status(204).end();
            }
        } else {
            files.forEach(function (filename) {
                fs.unlinkSync(path.join(config.TEMP_FOLDER, id, filename));
            });
            fs.rmdirSync(path.join(config.TEMP_FOLDER, id));
            res.status(204).end();
        }

    });

});

app.get(config.LOCATION + '/:id', function (req, res) {
    var id = req.params.id;
    
    var directoryPath = path.join(config.TEMP_FOLDER, id);
    fs.readdir(directoryPath, function (err, files) {
        if (err) {
            res.status(404).end();
        } else {
            if (files && files.length) {
                var fileName = files[0];
                var filePath = path.join(directoryPath, fileName);
                
                res.writeHead(200, {
                    'Content-Length': fs.statSync(filePath).size,
                    'Content-disposition': 'attachment; filename=' + fileName
                });
                
                fs.createReadStream(filePath).pipe(res);
            } else {
                res.status(404).end();
            }
        }
    });
});



app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

module.exports = app;