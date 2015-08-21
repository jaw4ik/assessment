'use strict';

var 
    fs = require('fs'),
    path = require('path'),

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

//app.use(cors());
app.use(morgan('dev'));

app.get(config.LOCATION + '/', function (req, res) {
    res.send('OK');
});

function authorize(req, res, next) {
    if (req && req.headers && req.headers.authorization) {
        request({
            url: config.IDENTITY_URL,
            method: 'POST',
            headers: {
                Authorization: req.headers.authorization
            }
        }, function (err, response, body) {
            if (err) {
                res.status(401).send('401 Unauthorized');
                return;
            }
            
            try {
                var json = JSON.parse(body);
                if (json.success && json.data && json.data.email) {
                    next();
                } else {
                    res.status(401).send('401 Unauthorized');
                }
            } catch (e) {
                res.status(401).send('401 Unauthorized');
            }
        });

    } else {
        res.status(401).send('401 Unauthorized');
    }
}

app.post(config.LOCATION + '/', [authorize], function(req, res) {

    var busboy = new Busboy({ headers: req.headers });

    var promises = [];
    busboy.on('file', function(name, file, filename) {
        if (filename.length === 0) {
            file.resume();
        } else {
            var id = uuid.v4();

            var directoryPath = path.join(config.TEMP_FOLDER, id);
            fs.mkdirSync(directoryPath);

            promises.push(converter.run(file, directoryPath)
                .then(function(metadata) {
                    return {
                        id: id,
                        duration: metadata.duration
                    };
                })
                .catch(function(reason) {
                    file.resume();
                    throw reason;
                }));
        }
    });

    busboy.on('finish', function() {
        Q.all(promises).then(function(files) {
                if (files.length === 0) {
                    res.status(400).send('You have to provide at least 1 file');
                } else {
                    res.send(files.map(function(file) {
                        return {
                            id: file.id,
                            duration: file.duration,
                            url: req.protocol + '://' + req.get('host') + req.originalUrl + '/' + file.id
                        };
                    }));
                }
            })
            .catch(function(reason) {
                res.status(400).send('Unable to process file(s)');
            });
    });

    return req.pipe(busboy);
});

app.delete(config.LOCATION + '/:id', [authorize], function(req, res) {
    var id = req.params.id;

    fs.readdir(path.join(config.TEMP_FOLDER, id), function(err, files) {
        if (err) {
            if (err.code !== "ENOENT") {
                throw err;
            } else {
                res.status(204).end();
            }
        } else {
            files.forEach(function(filename) {
                fs.unlinkSync(path.join(config.TEMP_FOLDER, id, filename));
            });
            fs.rmdirSync(path.join(config.TEMP_FOLDER, id));
            res.status(204).end();
        }

    });

});

app.get(config.LOCATION + '/:id', function(req, res) {
    var id = req.params.id;

    var directoryPath = path.join(config.TEMP_FOLDER, id);
    fs.readdir(directoryPath, function(err, files) {
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


app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

module.exports = app;