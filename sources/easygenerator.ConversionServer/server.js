'use strict';

var 
    fs = require('fs'),
    path = require('path'),

    express = require('express'),
    app = express(),
    cors = require('cors'),
    morgan = require('morgan'),
    Busboy = require('busboy'),
    uuid = require('node-uuid'),

    ffmpeg = require('fluent-ffmpeg'),

    Promise = require('promise'),

    config = require('./config')
;

ffmpeg.setFfmpegPath(config.FFMPEG_PATH);
ffmpeg.setFfprobePath(config.FFMPEG_PROBE_PATH);

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

app.post(config.LOCATION + '/', function (req, res) {
    var busboy = new Busboy({ headers: req.headers });
    
    var promises = [];
    
    busboy.on('file', function (name, file, filename, transferEncoding, mimeType) {
        if (filename.length === 0 || mimeType.indexOf('audio/') !== 0) {
            file.resume();
        } else {
            var id = uuid.v4();

            var directoryPath = path.join(config.TEMP_FOLDER, id);
            fs.mkdirSync(directoryPath);

            promises.push(
                new Promise(function(resolve, reject) {
                    var output = path.join(config.TEMP_FOLDER, id, config.OUTPUT_NAME);
                    ffmpeg()
                        .format('mp4')
                        .addInput(file)
                        .addInput('D:\\Development\\ffmpeg\\image.jpg')
                        .videoCodec('mpeg4')
                        .audioCodec('libmp3lame')
                        .output(output)
                        .on('end', function() {
                            resolve(id);
                        })
                        .on('error', function(err, stdout, stderr) {
                            console.log('Cannot process video: ' + err.message);
                            reject(err.message);

                        }).run();
                })
            );

        }
    });

    busboy.on('finish', function() {
        Promise.all(promises).then(function(files) {
                if (files.length === 0) {
                    res.status(400).send('Bad request');
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
                res.status(500).send('Internal Server Error');
            });

    });
    
    return req.pipe(busboy);
});

app.get(config.LOCATION + '/:id', function (req, res) {
    var id = req.params.id;
    
    fs.readdir(path.join(config.TEMP_FOLDER, id), function (err, files) {
        if (err) {
            res.status(404).end();
        } else {
            if (files && files.indexOf(config.OUTPUT_NAME) > -1) {
                var file = path.join(config.TEMP_FOLDER, id, config.OUTPUT_NAME);
                
                res.writeHead(200, {
                    'Content-Length': fs.statSync(file).size,
                    'Content-disposition': 'attachment; filename=' + config.OUTPUT_NAME
                });
                
                fs.createReadStream(file).pipe(res);
            } else {
                res.status(404).end();
            }
        }
    });
});

app.delete(config.LOCATION + '/:id', function (req, res) {
    var id = req.params.id;
    
    fs.readdir(path.join(config.TEMP_FOLDER, id), function (err, files) {
        if (err) {
            if (err.code != "ENOENT") {
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

app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

module.exports = app;