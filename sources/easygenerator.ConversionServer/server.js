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
    config = require('./config')
;

app.use(cors());
app.use(morgan('dev'));

app.get(config.LOCATION + '/', function (req, res) {
    res.send('<html>' +
        '       <head>' +
        '       </head>' +
        '       <body>' +
        '           <form method="POST" enctype="multipart/form-data">' +
        '               <input type="file" name="file">' +
        '               <input type="submit">' +
        '           </form>' +
        '       </body>' +
        '    </html>');
});

app.post(config.LOCATION + '/', function(req, res) {
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
                .then(function() {
                    return id;
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

                    res.format({
                        'text/html': function() {
                            res.send('<html>' +
                                '       <head>' +
                                '       </head>' +
                                '       <body>' +
                                '           <ul>' +
                                files.map(function(id) {
                                    var url = req.protocol + '://' + req.get('host') + req.originalUrl + '/' + id;
                                    return '<li><a href="' + url + '">' + url + '</a></li>';
                                }).join() +
                                '           </ul>' +
                                '       </body>' +
                                '     </html>');
                        },
                        'application/json': function() {
                            res.send(files.map(function(id) {
                                return {
                                    id: id,
                                    url: req.protocol + '://' + req.get('host') + req.originalUrl + '/' + id
                                };
                            }));
                        },
                        'default': function() {
                            res.status(406).send('Not Acceptable');
                        }
                    });
                }
            })
            .catch(function(reason) {
                console.log(reason);
                res.status(422).send('Unable to process file(s)');
            });

    });

    return req.pipe(busboy);
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

app.delete(config.LOCATION + '/:id', function(req, res) {
    var id = req.params.id;

    fs.readdir(path.join(config.TEMP_FOLDER, id), function(err, files) {
        if (err) {
            if (err.code != "ENOENT") {
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

app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

module.exports = app;