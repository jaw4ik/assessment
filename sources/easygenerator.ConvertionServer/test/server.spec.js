'use strict';

var 
    app = require('./../server'),
    config = require('./../config'),

    assert = require('assert'),

    uuid = require('node-uuid'),

    request = require('supertest')(app),    
    fs = require('fs'),
    path = require('path');

var ApplicationId = '6e9dcd5877c94d9a-9dea2fc30afce628';

describe('server', function () {
    
    before(function (done) {
        config.TEMP_FOLDER = path.join(__dirname, 'TEMP');
        config.SAMPLE_MP3 = path.join(__dirname, 'sample.mp3');
        config.SAMPLE_AU = path.join(__dirname, 'sample.au');
        config.SAMPLE_AIF = path.join(__dirname, 'sample.aif');
        config.SAMPLE_FLAC = path.join(__dirname, 'sample.flac');
        config.SAMPLE_OGG = path.join(__dirname, 'sample.ogg');
        config.SAMPLE_WAV = path.join(__dirname, 'sample.wav');
        config.SAMPLE_TXT = path.join(__dirname, '..', 'README.MD');
        config.applications = [ApplicationId];
        
        fs.mkdir(path.join(config.TEMP_FOLDER), function (err) {
            if (err && err.code != "EEXIST") {
                throw err;
            } else {
                done();
            }
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

    describe('post \'/\'', function() {

        describe('when ticket is supplied', function() {

            var ticketId;

            beforeEach(function(done) {
                request
                    .post(config.LOCATION + '/tickets')
                    .set('Accept', 'application/json')
                    .set('Authorization', 'Bearer ' + ApplicationId)
                    .end(function(err, res) {
                        if (err) {
                            return done(err);
                        }
                        ticketId = res.text;
                        done();
                    });
            });

            it('returns 200', function(done) {
                request
                    .post(config.LOCATION + '/')
                    .set('Accept', 'application/json')
                    .set('ticket', ticketId)
                    .attach('file', config.SAMPLE_MP3)
                    .expect(200, done());
            });

            it('converts input mp3 to mp4', function(done) {
                request
                    .post(config.LOCATION + '/')
                    .set('Accept', 'application/json')
                    .set('ticket', ticketId)
                    .attach('file', config.SAMPLE_MP3)
                    .end(function(err, res) {
                        if (err) {
                            return done(err);
                        }
                        assert(fs.existsSync(path.join(config.TEMP_FOLDER, res.body[0].id, "output.mp4")));
                        done();
                    });
            });

            it('converts input aif to mp4', function(done) {
                request
                    .post(config.LOCATION + '/')
                    .set('Accept', 'application/json')
                    .set('ticket', ticketId)
                    .attach('file', config.SAMPLE_AIF).end(function(err, res) {
                        if (err) {
                            return done(err);
                        }
                        assert(fs.existsSync(path.join(config.TEMP_FOLDER, res.body[0].id, "output.mp4")));
                        done();
                    });
            });

            it('converts input au to mp4', function(done) {
                request
                    .post(config.LOCATION + '/')
                    .set('Accept', 'application/json')
                    .set('ticket', ticketId)
                    .attach('file', config.SAMPLE_AU)
                    .end(function(err, res) {
                        if (err) {
                            return done(err);
                        }
                        assert(fs.existsSync(path.join(config.TEMP_FOLDER, res.body[0].id, "output.mp4")));
                        done();
                    });
            });

            it('converts input flac to mp4', function(done) {
                request
                    .post(config.LOCATION + '/')
                    .set('Accept', 'application/json')
                    .set('ticket', ticketId)
                    .attach('file', config.SAMPLE_FLAC)
                    .end(function(err, res) {
                        if (err) {
                            return done(err);
                        }
                        assert(fs.existsSync(path.join(config.TEMP_FOLDER, res.body[0].id, "output.mp4")));
                        done();
                    });
            });

            it('converts input ogg to mp4', function(done) {
                request
                    .post(config.LOCATION + '/')
                    .set('Accept', 'application/json')
                    .set('ticket', ticketId)
                    .attach('file', config.SAMPLE_OGG)
                    .expect(200)
                    .end(function(err, res) {
                        if (err) {
                            return done(err);
                        }
                        assert(fs.existsSync(path.join(config.TEMP_FOLDER, res.body[0].id, "output.mp4")));
                        done();
                    });
            });

            it('converts input wav to mp4', function(done) {
                request
                    .post(config.LOCATION + '/')
                    .set('Accept', 'application/json')
                    .set('ticket', ticketId)
                    .attach('file', config.SAMPLE_WAV)
                    .end(function(err, res) {
                        if (err) {
                            return done(err);
                        }
                        assert(fs.existsSync(path.join(config.TEMP_FOLDER, res.body[0].id, "output.mp4")));
                        done();
                    });
            });

            it('returns json with file list', function(done) {
                request
                    .post(config.LOCATION + '/')
                    .set('Accept', 'application/json')
                    .set('ticket', ticketId)
                    .attach('file', config.SAMPLE_WAV)
                    .end(function(err, res) {
                        if (err) {
                            return done(err);
                        }
                        assert(res.body[0].id.length === 36);
                        done();
                    });
            });

            describe('when no file attached', function() {

                it('returns 400', function(done) {
                    request
                        .post(config.LOCATION + '/')
                        .set('Accept', 'text/html')
                        .set('ticket', ticketId)
                        .field('Content-Type', 'multipart/form-data')
                        .expect(400, done);
                });

            });

            describe('when audio is not attached', function() {

                it('returns 400', function(done) {
                    request
                        .post(config.LOCATION + '/')
                        .set('Accept', 'application/json')
                        .set('ticket', ticketId)
                        .attach('file', config.SAMPLE_TXT)
                        .expect(400, done);
                });

            });

        });

        describe('when no ticket supplied', function() {

            it('returns 401', function(done) {
                request
                    .post(config.LOCATION + '/')
                    .set('Accept', 'application/json')
                    .expect(401)
                    .end(function(err) {
                        if (err) {
                            return done(err);
                        }
                        done();
                    });
            });

        });

        describe('when ticket is invalid', function() {

            it('returns 401', function(done) {
                request
                    .post(config.LOCATION + '/')
                    .set('Accept', 'application/json')
                    .set('ticket', 'ticketId')
                    .expect(401)
                    .end(function(err) {
                        if (err) {
                            return done(err);
                        }
                        done();
                    });
            });

        });

    });

    describe('delete \'/:id\'', function() {

        describe('when ticket supplied', function() {

            var ticketId;

            beforeEach(function(done) {
                request
                    .post(config.LOCATION + '/tickets')
                    .set('Accept', 'application/json')
                    .set('Authorization', 'Bearer ' + ApplicationId)
                    .end(function(err, res) {
                        ticketId = res.text;
                        done();
                    });
            });

            it('returns 204 when file doest not exist', function(done) {
                request
                    .delete(config.LOCATION + '/_id')
                    .set('ticket', ticketId)
                    .expect(204, done);
            });

            it('deletes file with specified id', function(done) {

                var id = uuid.v4();
                var filename = "filename.txt";
                fs.mkdirSync(path.join(config.TEMP_FOLDER, id));
                fs.writeFileSync(path.join(config.TEMP_FOLDER, id, filename), 'Hello Node');

                request
                    .delete(config.LOCATION + '/' + id)
                    .set('ticket', ticketId)
                    .end(function(err) {
                        if (err) {
                            return done(err);
                        }
                        assert(!fs.existsSync(path.join(config.TEMP_FOLDER, id, filename)));
                        assert(!fs.existsSync(path.join(config.TEMP_FOLDER, id)));
                        done();
                    });
            });

            it('returns 204', function(done) {

                var id = uuid.v4();
                var filename = "filename.txt";
                fs.mkdirSync(path.join(config.TEMP_FOLDER, id));
                fs.writeFileSync(path.join(config.TEMP_FOLDER, id, filename), 'Hello Node');

                request
                    .delete(config.LOCATION + '/' + id)
                    .set('ticket', ticketId)
                    .expect(204, done);
            });
        });


        describe('when no ticket supplied', function() {

            it('returns 401', function(done) {
                request
                    .delete(config.LOCATION + '/' + uuid.v4())
                    .expect(401)
                    .end(function(err) {
                        if (err) {
                            return done(err);
                        }
                        done();
                    });
            });

        });

        describe('when ticket is invalid', function() {

            it('returns 401', function(done) {
                request
                    .delete(config.LOCATION + '/' + uuid.v4())
                    .set('ticket', 'ticketId')
                    .expect(401)
                    .end(function(err) {
                        if (err) {
                            return done(err);
                        }
                        done();
                    });
            });

        });

    });
    
    describe('get \'/:id\'', function () {
        
        it('returns not found when file does not exist', function (done) {
            request
                .get(config.LOCATION + '/file/_id')
                .expect(404, done);
        });
        
        it('returns file when it exists', function (done) {
            var id = uuid.v4();
            var filename = "output.mp4";
            fs.mkdirSync(path.join(config.TEMP_FOLDER, id));
            fs.writeFileSync(path.join(config.TEMP_FOLDER, id, filename), 'Hello Node');
            
            request
                .get(config.LOCATION + '/' + id)
                .expect(200, done);
        });

    });

});