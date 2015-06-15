'use strict';

var 
    app = require('./../server'),
    config = require('./../config'),

    assert = require('assert'),

    uuid = require('node-uuid'),

    request = require('supertest'),
    fs = require('fs'),
    path = require('path');

describe('controller', function () {
    
    before(function (done) {
        config.TEMP_FOLDER = path.join(__dirname, "TEMP");

        fs.mkdir(path.join(config.TEMP_FOLDER), function(err) {
            if (err && err.code != "EEXIST") {
                throw err;
            } else {
                done();
            }
        });
    });
    
    describe('get \'/\'', function () {
        
        it('returns html form to upload file', function (done) {
            request(app)
                .get('/')
                .expect(200)
                .end(function(err, res) {
                    if (err) {
                        return done(err);
                    }
                    assert(res.text.indexOf('<html>') === 0);
                    done();
                });
        });

    });
    
    describe('post \'/\'', function () {
        
        it('saves original file to temporary directory', function (done) {
            request(app)
                .post('/')
                .set('Accept', 'application/json')
                .attach('file', 'README.MD')
                .expect(200)
                .end(function(err, res) {
                    if (err) {
                        return done(err);
                    }
                    assert(fs.existsSync(path.join(config.TEMP_FOLDER, res.body.id, 'README.MD')));
                    done();
                });
        });
        
        it('returns json with file id', function (done) {
            request(app)
                .post('/')
                .set('Accept', 'application/json')
                .attach('file', 'README.MD')
                .expect(200)
                .end(function(err, res) {
                    if (err) {
                        return done(err);
                    }
                    assert(res.body.id.length === 36);
                    done();
                });
        });

    });
    
    describe('get \'/file/:id\'', function () {
        
        it('returns not found when file does not exist', function (done) {
            request(app)
                .get('/file/_id')
                .expect(404, done);
        });

        it('returns file when it exists', function(done) {
            var id = uuid.v4();
            var filename = "filename.txt";
            fs.mkdirSync(path.join(config.TEMP_FOLDER, id));
            fs.writeFileSync(path.join(config.TEMP_FOLDER, id, filename), 'Hello Node');

            request(app)
                .get('/file/' + id)
                .expect(200, done);
        });

    });
    
    after(function () {
        fs.readdirSync(config.TEMP_FOLDER).forEach(function(subfolder) {
            fs.readdirSync(path.join(config.TEMP_FOLDER, subfolder)).forEach(function(filename) {
                fs.unlinkSync(path.join(config.TEMP_FOLDER, subfolder, filename));
            });
            fs.rmdirSync(path.join(config.TEMP_FOLDER, subfolder));
        });
        fs.rmdirSync(path.join(config.TEMP_FOLDER));
    });

});