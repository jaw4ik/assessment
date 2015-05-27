define(['videoUpload/handlers/progress'], function (progressHandler) {
    "use strict";
    var constants = require('constants'),
        storageCommands = require('videoUpload/commands/storage'),
        vimeoCommands = require('videoUpload/commands/vimeo');

    describe('[progressHandler]', function () {

        it('should be object', function () {
            expect(progressHandler).toBeObject();
        });

        describe('build', function () {
            var defer;

            beforeEach(function () {
                defer = Q.defer();
                spyOn(storageCommands, 'updateUploadTimeout').and.returnValue(defer.promise);
                spyOn(vimeoCommands, 'verifyUpload').and.returnValue(defer.promise);
            });

            it('should be function', function () {
                expect(progressHandler.build).toBeFunction();
            });

            it('should build progress handler ', function () {
                var uploadUrl = '123',
                    fileSize = 100,
                    video = { id: 0, progress: 0 },
                    videoFileLoadedCallback = function (videoId) {
                        return videoId;
                    };
                var progressHandl = progressHandler.build(uploadUrl, fileSize, video, videoFileLoadedCallback);

                expect(progressHandl.id).toBe(video.id);
                expect(progressHandl.updatedOn).toBeDefined();
                expect(progressHandl.handler).toBeFunction();
            });

            describe('progressHandler.handler', function () {
                var progressHandl,
                    uploadUrl = '123',
                    fileSize = 100,
                    video = { id: 0, progress: 0 },
                    videoFileLoadedCallback = function (videoId) {
                        video.progress = 'called';
                    };

                beforeEach(function () {
                    uploadUrl = uploadUrl;
                    fileSize = fileSize;
                    video = video;
                    videoFileLoadedCallback = videoFileLoadedCallback;
                    progressHandl = progressHandler.build(uploadUrl, fileSize, video, videoFileLoadedCallback);
                });

                it('should be function', function () {
                    expect(progressHandl.handler).toBeFunction();
                });

                it('should return promise', function () {
                    expect(progressHandl.handler()).toBePromise();
                });

                it('should verify upload', function () {
                    progressHandl.handler();

                    expect(vimeoCommands.verifyUpload).toHaveBeenCalledWith(uploadUrl);

                });

                describe('when verify query failed', function () {

                    it('should set video progress to zero', function (done) {

                        defer.reject();
                        video.progress = 50;
                        var promise = progressHandl.handler();
                        promise.fin(function() {
                            expect(video.progress).toBe(0);
                            done();
                        });

                    });

                });

                describe('when verify query resolved with range', function () {

                    it('should set video progress in persentages', function (done) {

                        defer.resolve('bytes 0-50');
                        video.progress = 0;

                        var promise = progressHandl.handler();
                        promise.fin(function () {
                            expect(video.progress).toBe(50);
                            done();
                        });

                    });

                    describe('and size in range equals fileSize', function () {

                        it('should call videoFileLoadedCallback', function (done) {

                            defer.resolve('bytes 0-100');
                            video.progress = 0;

                            var promise = progressHandl.handler();
                            promise.fin(function () {
                                expect(video.progress).toBe('called');
                                done();
                            });

                        });

                    });

                    describe('and update upload timeout is over', function () {

                        it('should update updatedOn', function (done) {

                            var updatedOn = new Date() - constants.storage.video.updateUploadTimeout - 1000;
                            progressHandl.updatedOn = updatedOn;

                            defer.resolve('bytes 0-50');

                            var promise = progressHandl.handler();
                            promise.fin(function () {
                                expect(progressHandl.updatedOn).not.toBe(updatedOn);
                                done();
                            });

                        });

                        it('should send update upload timeout query to storage', function (done) {

                            var updatedOn = new Date() - constants.storage.video.updateUploadTimeout - 1000;
                            progressHandl.updatedOn = updatedOn;

                            defer.resolve('bytes 0-50');

                            var promise = progressHandl.handler();
                            promise.fin(function () {
                                expect(storageCommands.updateUploadTimeout).toHaveBeenCalledWith(video.id);
                                done();
                            });

                        });

                    });

                });

            });

        });

    });

});