var express = require('express');
var app = express();

var path = require('path'),
    fs = require('fs'),
    uuid = require('node-uuid');

var Busboy = require('busboy');

var TEMP_DIR = "D:\\TEMP";

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
    var id = uuid.v4();
    var busboy = new Busboy({ headers: req.headers });
    
    busboy.on('file', function (name, file, filename) {
        fs.mkdirSync(path.join(TEMP_DIR, id));
        file.pipe(fs.createWriteStream(path.join(TEMP_DIR, id, filename)));
    });
    busboy.on('finish', function () {
        res.writeHead(200, { 'Connection': 'close' });
        res.end('<html>' +
            '       <head>' +
            '       </head>' +
            '       <body>' +
            '           That\'s all folks! id: <a href="http://localhost:3000/file/' + id + '">' + id + '</a>' +
            '       </body>' +
            '   </html>');
    });
    return req.pipe(busboy);
});

app.get('/file/:id', function (req, res) {
    var id = req.params('id');
    
    if (id.length != 36) {
        res.status(400).end();
    } else {
        var files = fs.readdirSync(path.join(TEMP_DIR, id));
        if (files && files.length) {
            var file = path.join(TEMP_DIR, id, files[0]);
            
            res.writeHead(200, {
                //'Content-Type': 'audio/mpeg',
                'Content-Length': fs.statSync(file).size
            });
            
            fs.createReadStream(file).pipe(res);
        }
    }
});

var server = app.listen(3000, function () {
    
    var host = server.address().address;
    var port = server.address().port;
    
    console.log('Example app listening at http://%s:%s', host, port);

});