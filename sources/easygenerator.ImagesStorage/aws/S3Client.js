'use strict';

var knox = require('knox');
var _clients = new WeakMap();

class S3Client {
    constructor(key, secret, bucket) {
        _clients.set(this, knox.createClient({
            key,
            secret,
            bucket
        }));
    }
    fileExists(filename){
        return new Promise((resolve, reject) => {
            _clients.get(this).headFile(filename, (err, res) => {
                if (err || res.statusCode !== 200) {
                    return resolve(false);
                }
                resolve(true);
            });
        });
    }
    getFile(filename) {
        return new Promise((resolve, reject) => {
            _clients.get(this).getFile(filename, (err, res) => {
                if (err || res.statusCode !== 200) {
                    resolve(false);
                    return;
                }
                let buffers = [];
                res.on('data', chunk => {
                    buffers.push(chunk);
                });
                res.on('end', () => {
                    let buf = Buffer.concat(buffers);
                    resolve(buf);
                });
            });
        });
    }
    putBuffer(buffer, path, contentType) {
        return new Promise((resolve, reject) => {
            let headers = {
                'Content-Type': contentType,
                'x-amz-acl': 'public-read'
            };
            _clients.get(this).putBuffer(buffer, path, headers, (err, res) => {
                if (err || res.statusCode !== 200) {
                    resolve(false);
                    return;
                }
                resolve(true);
            });
        });
    }
    deleteFile(path) {
        return new Promise((resolve, reject) => {
            _clients.get(this).deleteFile(path, (err, res) => {
                if (err || res.statusCode !== 200 || res.statusCode !== 204) {
                    resolve(false);
                    return;
                }
                resolve(true);
            });
        });
    }
    deleteMultiple(files){
        return new Promise((resolve, reject) => {
            _clients.get(this).deleteMultiple(files, (err, data) => {
                resolve();
            });
        });
    }
    list(prefix){
        return new Promise((resolve, reject) => {
            _clients.get(this).list({ prefix }, (err, data) => {
                if(err){
                    resolve(false);
                }
                var objects = [];
                data.Contents.forEach(content => {
                    objects.push(content.Key);
                });
                resolve(objects);
            })
        })
    }
}

module.exports = S3Client;