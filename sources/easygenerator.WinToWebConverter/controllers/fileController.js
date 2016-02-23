'use strict';

var path = require('path');
var _ = require('lodash');
var del = require('del');
var express = require('express');
var Busboy = require('Busboy');
var uuid = require('node-uuid');
var config = require('../config');
var converter = require('../converter');
var ticketDispatcher = require('../components/ticketDispatcher');

var router = express.Router();

function useTicket(req, res, next) {
    if (ticketDispatcher.use(req.get('ticket'))) {
        next();
    } else {
        res.status(401).send('401 Unauthorized');
    }
}

router.post('/', [useTicket], (req, res) => {
    let busboy = new Busboy({ headers: req.headers });

    let promises = [];

	let id = uuid.v4();

    busboy.on('file', (name, file, filename) => {
        if (filename.length === 0) {
            file.resume();
        } else {
            let data = [];
            let dataLength = 0;
            
            file.on('data', chunk => {
                data.push(chunk);
                dataLength += chunk.length;
            });

            file.on('end', () => {
                let directoryPath = path.join(config.TEMP_FOLDER, id);
                let buffer = new Buffer(dataLength);
                for (var i = 0, length = data.length, position = 0; i < length; i++) {
                    data[i].copy(buffer, position);
					position += data[i].length;
                }
				let authToken = req.get('authorization') && req.get('authorization').split(' ')[1];

                promises.push(converter.run(buffer, directoryPath, authToken)
                    .then(course => course)
                    .catch(reason => {
                        file.resume();
                        throw reason;
                    }));
            });
        }
    });

    busboy.on('finish', () => {
        Promise.all(promises).then(courses => {
            if (courses.length === 0) {
                res.status(400).send('You have to provide at least 1 file');
            } else {
				del([path.join(config.TEMP_FOLDER, id)], { force: true }).then(function () {
					res.send(courses.map(course => course));
				}).catch(function () {
					res.status(500).send();
				});
				res.send(courses.map(course => course));
            }
        }).catch(reason => {
            res.status(400).send('Unable to process file(s)');
        });
    });

    return req.pipe(busboy);
});

module.exports = router;