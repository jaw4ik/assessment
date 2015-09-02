'use strict';

var 
    fs = require('fs'),
    rmrf = require('rimraf'),
    del = require('del'),
    path = require('path'),
    Q = require('q'),
    uuid = require('node-uuid'),
    Busboy = require('busboy'),
    express = require('express'),
    
    router = express.Router();

var 
    ticketDispatcher = require('./ticketDispatcher'),
    converter = require('./converter'),

    config = require('./config');


function useTicket(req, res, next) {
    if (ticketDispatcher.use(req.get('ticket'))) {
        next();
    } else {
        res.status(401).send('401 Unauthorized');
    }
}

router.post('/', [useTicket], function(req, res) {
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

router.delete('/:id', [useTicket], function(req, res) {
    var id = req.params.id;

    console.log(path.join(config.TEMP_FOLDER, id, '**');

    del(path.join(config.TEMP_FOLDER, id), function(err, a) {
        if (err) {
            res.status(500).end();
        } else {
            res.status(204).end();
        }
    });
});

router.get('/:id', function(req, res) {
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

module.exports = router;