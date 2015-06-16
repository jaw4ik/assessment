var express = require('express');
var app = express();

var path = require('path'),
    fs = require('fs'),
    uuid = require('node-uuid'),
    config = require('./config')
    ;

var Busboy = require('busboy');


app.get('/', function (req, res) {
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

app.post('/', function (req, res) {
    var busboy = new Busboy({ headers: req.headers });
    
    var files = [];
    
    busboy.on('file', function (name, file, filename) {
        var id = uuid.v4();
        
        var directoryPath = path.join(config.TEMP_FOLDER, id);
        fs.mkdirSync(directoryPath);
        
        var filePath = path.join(directoryPath, filename);
        file.on('end', function () {
            files.push({
                id: id
            });
        });
        file.pipe(fs.createWriteStream(filePath));
    });
    busboy.on('finish', function () {
        res.status(200).send(files);
    });

    return req.pipe(busboy);
});

app.get('/file/:id', function (req, res) {
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

var server = app.listen(3000, function () {
    
    var host = server.address().address;
    var port = server.address().port;
    
    console.log('Example app listening at http://%s:%s', host, port);

});

module.exports = app;