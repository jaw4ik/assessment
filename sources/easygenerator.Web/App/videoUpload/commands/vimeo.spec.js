define(['videoUpload/commands/vimeo'], function (vimeoCommands) {
    "use strict";
    var constants = require('constants');

    describe('[vimeoCommands]', function () {

        it('should be object', function () {
            expect(vimeoCommands).toBeObject();
        });

        describe('putFile', function () {
            var defer;

            beforeEach(function () {
                defer = Q.defer();
                spyOn($, 'ajax').and.returnValue(defer.promise);
            });

            it('should be function', function () {
                expect(vimeoCommands.putFile).toBeFunction();
            });

            it('should return promise', function () {
                expect(vimeoCommands.putFile()).toBePromise();
            });

            it('should send put request', function () {
                var uploadUrl = '123',
                    file = {};

                vimeoCommands.putFile(uploadUrl, file);

                expect($.ajax).toHaveBeenCalledWith({
                    url: uploadUrl,
                    method: 'PUT',
                    data: file,
                    processData: false,
                    contentType: false,
                    global: false
                });

            });

        });

        describe('verifyUpload', function () {
            var defer;

            beforeEach(function () {
                defer = $.Deferred();
                spyOn($, 'ajax').and.returnValue(defer.promise());
            });

            it('should be function', function () {
                expect(vimeoCommands.verifyUpload).toBeFunction();
            });

            it('should return promise', function () {
                expect(vimeoCommands.verifyUpload()).toBePromise();
            });

            it('should send put request', function () {
                var uploadUrl = '123';

                vimeoCommands.verifyUpload(uploadUrl);

                expect($.ajax).toHaveBeenCalledWith({
                    url: uploadUrl,
                    method: 'PUT',
                    headers: { 'Content-Range': 'bytes */*' },
                    global: false
                });

            });

            describe('when put request failed with not 308 (vimeo success) status', function () {

                it('should reject promise with status', function (done) {
                    var uploadUrl = '123';

                    var reason = { status: 404 };

                    defer.reject(reason);

                    var promise = vimeoCommands.verifyUpload(uploadUrl);
                    promise.fin(function () {
                        expect(promise).toBeRejectedWith(reason.status);
                        done();
                    });

                });
            });

            describe('when put request failed with 308 (vimeo success) status', function () {

                it('should resolve promise with status', function (done) {
                    var uploadUrl = '123';

                    var reason = {
                        status: 308, headers: { 'Range': '1' }, getResponseHeader: function (header) {
                            return this.headers[header];
                        }
                    };

                    defer.reject(reason);

                    var promise = vimeoCommands.verifyUpload(uploadUrl);
                    promise.fin(function () {
                        expect(promise).toBeResolvedWith('1');
                        done();
                    });

                });
            });

        });

        describe('getThumbnailUrl', function () {
            var defer;

            beforeEach(function () {
                defer = $.Deferred();
                spyOn($, 'ajax').and.returnValue(defer.promise());
            });

            it('should be function', function () {
                expect(vimeoCommands.getThumbnailUrl).toBeFunction();
            });

            it('should return promise', function () {
                expect(vimeoCommands.getThumbnailUrl()).toBePromise();
            });

            it('should send get request', function () {
                var videoId = 0;
                vimeoCommands.getThumbnailUrl(videoId);

                expect($.ajax).toHaveBeenCalledWith({
                    url: constants.storage.video.vimeoApiVideosUrl + videoId + '/pictures',
                    headers: { Authorization: constants.storage.video.vimeoToken },
                    method: 'GET',
                    global: false
                });
            });

            describe('when get request failed', function () {

                it('should resolve promise with default image', function (done) {
                    var videoId = 0;

                    defer.reject();

                    var promise = vimeoCommands.getThumbnailUrl(videoId);
                    promise.fin(function () {
                        expect(promise).toBeResolvedWith(constants.storage.video.defaultThumbnailUrl);
                        done();
                    });

                });

            });

            describe('when get request resolved without thumbnail 150 * 200', function () {

                it('should resolve promise with default image', function (done) {

                    var videoId = 0;

                    defer.resolve({});

                    var promise = vimeoCommands.getThumbnailUrl(videoId);
                    promise.fin(function () {
                        expect(promise).toBeResolvedWith(constants.storage.video.defaultThumbnailUrl);
                        done();
                    });

                });
            });

            describe('when get request resolved with correct data', function () {

                it('should resolve promise with thumbnail', function (done) {

                    var videoId = 0;
                    var resolved = {
                        data: [{
                            sizes: [
                               {
                                   width: 350,
                                   height: 150,
                                   link: 'false'
                               },
                               {
                                   width: 200,
                                   height: 150,
                                   link: 'thumbnail'
                               }
                            ]
                        }]
                    };

                    defer.resolve(resolved);

                    var promise = vimeoCommands.getThumbnailUrl(videoId);
                    promise.fin(function () {
                        expect(promise).toBeResolvedWith(resolved.data[0].sizes[1].link);
                        done();
                    });

                });
            });

        });

    });

});