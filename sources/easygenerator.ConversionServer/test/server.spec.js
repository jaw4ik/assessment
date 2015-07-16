'use strict';

var 
    app = require('./../server'),
    config = require('./../config'),

    assert = require('assert'),

    uuid = require('node-uuid'),

    request = require('supertest'),
    fs = require('fs'),
    path = require('path');


describe('server', function () {
    
    before(function (done) {
        config.TEMP_FOLDER = path.join(__dirname, "TEMP");
        config.SAMPLE_MP3 = "sample.wav";
        config.SAMPLE_AU = "sample.au";
        config.SAMPLE_AIF = "sample.aif";
        config.SAMPLE_FLAC = "sample.flac";
        config.SAMPLE_OGG = "sample.ogg";
        config.SAMPLE_WAV = "sample.wav";
        config.SAMPLE_TXT = "README.MD";
        
        fs.mkdir(path.join(config.TEMP_FOLDER), function (err) {
            if (err && err.code != "EEXIST") {
                throw err;
            } else {
                done();
            }
        });
    });
    
    describe('get \'/\'', function () {

        it('returns html form to upload file', function(done) {
            request(app)
                .get(config.LOCATION + '/')
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
        
        //it('saves original file to temporary directory', function (done) {
        //    request(app)
        //        .post(config.LOCATION + '/')
        //        .set('Accept', 'application/json')
        //        .attach('file', config.SAMPLE_WAV)
        //        .expect(200)
        //        .end(function(err, res) {
        //            if (err) {
        //                return done(err);
        //            }
        //            assert(fs.existsSync(path.join(config.TEMP_FOLDER, res.body[0].id, config.SAMPLE_WAV)));
        //            done();
        //        });
        //});
        
        it('converts input mp3 to mp4', function (done) {
            var filename = "output.mp4";

            request(app)
                .post(config.LOCATION + '/')
                .set('Accept', 'application/json')
                .attach('file', config.SAMPLE_MP3)
                .expect(200)
                .end(function(err, res) {
                    if (err) {
                        return done(err);
                    }
                    assert(fs.existsSync(path.join(config.TEMP_FOLDER, res.body[0].id, filename)));
                    done();
                });
        });
        
        it('converts input aif to mp4', function (done) {
            var filename = "output.mp4";
            
            request(app)
                .post(config.LOCATION + '/')
                .set('Accept', 'application/json')
                .attach('file', config.SAMPLE_AIF)
                .expect(200)
                .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                assert(fs.existsSync(path.join(config.TEMP_FOLDER, res.body[0].id, filename)));
                done();
            });
        });
        
        it('converts input au to mp4', function (done) {
            var filename = "output.mp4";
            
            request(app)
                .post(config.LOCATION + '/')
                .set('Accept', 'application/json')
                .attach('file', config.SAMPLE_AU)
                .expect(200)
                .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                assert(fs.existsSync(path.join(config.TEMP_FOLDER, res.body[0].id, filename)));
                done();
            });
        });
        
        it('converts input flac to mp4', function (done) {
            var filename = "output.mp4";
            
            request(app)
                .post(config.LOCATION + '/')
                .set('Accept', 'application/json')
                .attach('file', config.SAMPLE_FLAC)
                .expect(200)
                .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                assert(fs.existsSync(path.join(config.TEMP_FOLDER, res.body[0].id, filename)));
                done();
            });
        });
        
        it('converts input ogg to mp4', function (done) {
            var filename = "output.mp4";
            
            request(app)
                .post(config.LOCATION + '/')
                .set('Accept', 'application/json')
                .attach('file', config.SAMPLE_OGG)
                .expect(200)
                .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                assert(fs.existsSync(path.join(config.TEMP_FOLDER, res.body[0].id, filename)));
                done();
            });
        });
        
        it('converts input wav to mp4', function (done) {
            var filename = "output.mp4";
            
            request(app)
                .post(config.LOCATION + '/')
                .set('Accept', 'application/json')
                .attach('file', config.SAMPLE_WAV)
                .expect(200)
                .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                assert(fs.existsSync(path.join(config.TEMP_FOLDER, res.body[0].id, filename)));
                done();
            });
        });

        it('returns json with file list when accept type is application/json', function (done) {
            request(app)
                .post(config.LOCATION + '/')
                .set('Accept', 'application/json')
                .attach('file', config.SAMPLE_WAV)
                .expect(200)
                .end(function(err, res) {
                    if (err) {
                        return done(err);
                    }
                    assert(res.body[0].id.length === 36);
                    done();
                });
        });
        
        it('returns html with file list when accept type is text/html', function (done) {
            request(app)
                .post(config.LOCATION + '/')
                .set('Accept', 'text/html')
                .attach('file', config.SAMPLE_WAV)
                .expect(200)
                .end(function(err, res) {
                    if (err) {
                        return done(err);
                    }
                    assert(res.text.indexOf('<html>') === 0);
                    done();
                });
        });
        
        it('returns 406 when accept type is not supported', function (done) {
            request(app)
                .post(config.LOCATION + '/')
                .set('Accept', 'text/undefined')
                .attach('file', config.SAMPLE_WAV)
                .expect(406, done);
        });
        
        it('returns 400 when no file attached', function (done) {
            request(app)
                .post(config.LOCATION + '/')
                .set('Accept', 'text/html')
                .field('Content-Type', 'multipart/form-data')
                .expect(400, done);
        });
        
        it('return 422 when only non-audio file attached', function (done) {
            request(app)
                .post(config.LOCATION + '/')
                .set('Accept', 'application/json')
                .attach('file', config.SAMPLE_TXT)
                .expect(422, done);
        });

    });
    
    describe('get \'/:id\'', function () {
        
        it('returns not found when file does not exist', function (done) {
            request(app)
                .get(config.LOCATION + '/file/_id')
                .expect(404, done);
        });
        
        it('returns file when it exists', function (done) {
            var id = uuid.v4();
            var filename = "output.mp4";
            fs.mkdirSync(path.join(config.TEMP_FOLDER, id));
            fs.writeFileSync(path.join(config.TEMP_FOLDER, id, filename), 'Hello Node');

            request(app)
                .get(config.LOCATION + '/' + id)
                .expect(200, done);
        });

    });
    
    describe('delete \'/:id\'', function () {
        
        it('returns 204 when file doest not exist', function (done) {
            request(app)
                .delete(config.LOCATION + '/_id')
                .expect(204, done);
        });
        
        it('deletes file with specified id when file was deleted', function (done) {
            var id = uuid.v4();
            var filename = "filename.txt";
            fs.mkdirSync(path.join(config.TEMP_FOLDER, id));
            fs.writeFileSync(path.join(config.TEMP_FOLDER, id, filename), 'Hello Node');

            request(app)
                .delete(config.LOCATION + '/' + id)
                .end(function(err) {
                    if (err) {
                        return done(err);
                    }
                    assert(!fs.existsSync(path.join(config.TEMP_FOLDER, id, filename)));
                    assert(!fs.existsSync(path.join(config.TEMP_FOLDER, id)));
                    done();
                });
        });
        
        it('returns 204 when file was deleted', function (done) {
            var id = uuid.v4();
            var filename = "filename.txt";
            fs.mkdirSync(path.join(config.TEMP_FOLDER, id));
            fs.writeFileSync(path.join(config.TEMP_FOLDER, id, filename), 'Hello Node');

            request(app)
                .delete(config.LOCATION + '/' + id)
                .expect(204, done);
        });

    });
    
    after(function () {
        fs.readdirSync(config.TEMP_FOLDER).forEach(function (subfolder) {
            fs.readdirSync(path.join(config.TEMP_FOLDER, subfolder)).forEach(function (filename) {
                fs.unlinkSync(path.join(config.TEMP_FOLDER, subfolder, filename));
            });
            fs.rmdirSync(path.join(config.TEMP_FOLDER, subfolder));
        });
        fs.rmdirSync(path.join(config.TEMP_FOLDER));
    });

});