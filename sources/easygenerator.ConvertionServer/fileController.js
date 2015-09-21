'use strict';

var 
    fs = require('fs'),
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

    del([path.join(config.TEMP_FOLDER, id)], { force: true }).then(function() {
        res.status(204).end();
    }).catch(function() {
        res.status(500).end();
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
                res.download(path.join(directoryPath, files[0]));
            } else {
                res.status(404).end();
            }
        }
    });
});

module.exports = router;