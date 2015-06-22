'use strict';

var 
    fs = require('fs'),
    path = require('path'),

    express = require('express'),
    app = express(),
    cors = require('cors'),
    Busboy = require('busboy'),
    uuid = require('node-uuid'),

    config = require('./config')
;

app.use(cors());

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
    
    var files = [];
    
    busboy.on('file', function (name, file, filename, transferEncoding, mimeType) {
        var id = uuid.v4();
        
        var directoryPath = path.join(config.TEMP_FOLDER, id);
        fs.mkdirSync(directoryPath);
        
        var filePath = path.join(directoryPath, filename);
        file.on('end', function () {
            files.push({
                id: id,
                url: req.protocol + '://' + req.get('host') + req.originalUrl + '/file/' + id
            });
        });
        file.pipe(fs.createWriteStream(filePath));
    });
    busboy.on('finish', function () {
        res.format({
            'text/html': function () {
                res.send('<html>' +
                    '       <head>' +
                    '       </head>' +
                    '       <body>' +
                    '           <ul>' +
                    files.map(function (item) { return '<li><a href="' + item.url + '">' + item.url + '</a></li>'; }).join() +
                    '           </ul>' +
                    '       </body>' +
                    '     </html>');
            },
            'application/json': function () {
                res.send(files);
            },
            'default': function () {
                res.status(406).send('Not Acceptable');
            }
        });
    });
    
    return req.pipe(busboy);
});

app.get(config.LOCATION + '/file/:id', function (req, res) {
    var id = req.params.id;
    
    fs.readdir(path.join(config.TEMP_FOLDER, id), function (err, files) {
        if (err) {
            res.status(404).end();
        } else {
            if (files && files.length) {
                var file = path.join(config.TEMP_FOLDER, id, files[0]);
                
                res.writeHead(200, {
                    'Content-Length': fs.statSync(file).size
                });
                
                fs.createReadStream(file).pipe(res);
            }
        }
       
    });
});

app.delete(config.LOCATION + '/file/:id', function (req, res) {
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

module.exports = app;