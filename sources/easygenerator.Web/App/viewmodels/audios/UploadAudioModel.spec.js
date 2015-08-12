define(['viewmodels/audios/UploadAudioModel'], function (Model) {

    describe('[UploadAudioModel]', function () {


        it('should be constructor function', function () {
            expect(Model).toBeFunction();
        });

        it('should create an instance of audio upload model', function () {
            expect(new Model({ name: 'sample.mp3' })).toBeObject();
        });

        it('should support events', function () {
            var model = new Model({
                name: 'sample.mp3'
            });
            expect(model.on).toBeFunction();
            expect(model.trigger).toBeFunction();
        });

        it('name should be defined', function () {
            var model = new Model({
                name: 'sample.mp3'
            });
            expect(model.name).toBeDefined();
            expect(model.name).toEqual('sample');
        });

        it('size should be defined', function () {
            var model = new Model({
                name: 'sample.mp3',
                size: 1
            });
            expect(model.size).toBeDefined();
            expect(model.size).toEqual(1);
        });

        it('upload progress should be defined', function () {
            var model = new Model({
                name: 'sample.mp3'
            });
            expect(model.progress).toBeDefined();
            expect(model.progress).toEqual(0);
        });

        it('status should be defined', function () {
            var model = new Model({
                name: 'sample.mp3'
            });
            expect(model.status).toBeDefined();
            expect(model.status).toEqual('not started');
        });

        it('error should be defined', function () {
            var model = new Model({
                name: 'sample.mp3'
            });
            expect(model.error).toBeDefined();
        });

        describe('upload:', function () {

            var convert = require('viewmodels/audios/commands/convert'),
                pull = require('viewmodels/audios/commands/pull'),
                convertDfd, pullDfd, model;

            beforeEach(function () {
                model = new Model({
                    name: 'sample.mp3'
                });
                spyOn(model, 'trigger');

                convertDfd = Q.defer();
                spyOn(convert, 'execute').and.returnValue(convertDfd.promise);
                pullDfd = Q.defer();
                spyOn(pull, 'execute').and.returnValue(pullDfd.promise);

            });

            it('should be function', function () {
                expect(model.upload).toBeFunction();
            });

            it('should return promise', function () {
                expect(model.upload()).toBePromise();
            });

            it('should set status to started', function () {
                model.upload();
                expect(model.status).toEqual('started');
            });

            it('should convert audio to video', function (done) {
                convertDfd.resolve({});
                pullDfd.resolve({});
                model.upload().then(function () {
                    expect(convert.execute).toHaveBeenCalled();
                    done();
                }).done();
            });

            describe('when progres is reported', function () {

                it('should set progress status', function (done) {
                    var promise = model.upload();
                    convertDfd.notify(20);
                    convertDfd.resolve({});
                    pullDfd.resolve({});
                    promise.then(function () {
                        expect(model.progress).toEqual(20);
                        done();
                    }).done();
                });

                it('should trigger progress event', function (done) {
                    var promise = model.upload();
                    convertDfd.notify(20);
                    convertDfd.resolve({});
                    pullDfd.resolve({});
                    promise.then(function () {
                        expect(model.trigger.calls.all()[1].args).toEqual(['progress', 20]);
                        done();
                    }).done();
                });

            });

            describe('when video is converted', function () {

                it('should request vimeo to pull video from conversion server', function (done) {
                    convertDfd.resolve({});
                    pullDfd.resolve({});
                    model.upload().then(function () {
                        expect(pull.execute).toHaveBeenCalled();
                        done();
                    }).done();
                });

                describe('when video is pulled by vimeo', function () {

                    var dataContext = require('dataContext');

                    it('should add entity to dataContext', function (done) {
                        dataContext.audios = [];
                        convertDfd.resolve({});
                        pullDfd.resolve({});
                        model.upload().then(function () {
                            expect(dataContext.audios.length).toEqual(1);
                            done();
                        }).done();
                    });

                    it('should set success status', function (done) {
                        convertDfd.resolve({});
                        pullDfd.resolve({});
                        model.upload().then(function () {
                            expect(model.status).toEqual('success');
                            done();
                        }).done();
                    });

                    it('should trigger success event', function (done) {
                        convertDfd.resolve({});
                        pullDfd.resolve({});
                        model.upload().then(function () {
                            expect(model.trigger.calls.mostRecent().args).toEqual(['success', jasmine.any(Object)]);
                            done();
                        }).done();
                    });

                });

                describe('when vimeo could not pull video', function () {

                    it('should set error status', function (done) {
                        convertDfd.resolve({});
                        pullDfd.reject({});
                        model.upload().catch(function () {
                            expect(model.status).toEqual('error');
                            done();
                        }).done();
                    });

                    it('should trigger error event', function (done) {
                        convertDfd.resolve({});
                        pullDfd.reject({});
                        model.upload().catch(function () {
                            expect(model.trigger.calls.mostRecent().args).toEqual(['error', jasmine.any(Object)]);
                            done();
                        }).done();
                    });

                });

            });

            describe('when video was not converted', function () {

                it('should set error status', function (done) {
                    convertDfd.reject({});
                    pullDfd.resolve({});
                    model.upload().catch(function () {
                        expect(model.status).toEqual('error');
                        done();
                    }).done();
                });

                it('should trigger error event', function (done) {
                    convertDfd.reject({});
                    pullDfd.resolve({});
                    model.upload().catch(function () {
                        expect(model.trigger.calls.mostRecent().args).toEqual(['error', jasmine.any(Object)]);
                        done();
                    }).done();
                });

            });


        });
    });

})