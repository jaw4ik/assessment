define(['videoUpload/commands/vimeo', 'constants'], function (vimeoCommands, constants) {
    "use strict";

    var storageConstants = constants.storage;

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

            /*describe('when put request failed with 308 (vimeo success) status', function () {

                it('should resolve promise with status', function (done) {
                    var uploadUrl = '123';

                    var reason = { status: 308, headers: {'Range': '1'} };

                    defer.resolve(reason);

                    var promise = vimeoCommands.verifyUpload(uploadUrl);
                    promise.fin(function () {
                        expect(promise).toBeResolvedWith('1');
                        done();
                    });

                });
            });*/

        });

       /* describe('updateUploadTimeout', function () {
            var defer;

            beforeEach(function () {
                defer = Q.defer();
                spyOn(storageHttpWrapper, 'post').and.returnValue(defer.promise);
            });

            it('should be function', function () {
                expect(storageCommands.updateUploadTimeout).toBeFunction();
            });

            it('should return promise', function () {
                expect(storageCommands.updateUploadTimeout()).toBePromise();
            });

            it('should send post request', function () {
                var videoId = 0;
                storageCommands.updateUploadTimeout(videoId);

                expect(storageHttpWrapper.post).toHaveBeenCalledWith(storageConstants.host + storageConstants.video.progressUrl, { videoId: videoId });
            });

        });

        describe('cancelUpload', function () {
            var defer;

            beforeEach(function () {
                defer = Q.defer();
                spyOn(storageHttpWrapper, 'post').and.returnValue(defer.promise);
            });

            it('should be function', function () {
                expect(storageCommands.cancelUpload).toBeFunction();
            });

            it('should return promise', function () {
                expect(storageCommands.cancelUpload()).toBePromise();
            });

            it('should send post request', function () {
                var videoId = 0;
                storageCommands.cancelUpload(videoId);

                expect(storageHttpWrapper.post).toHaveBeenCalledWith(storageConstants.host + storageConstants.video.cancelUrl, { videoId: videoId });
            });

        });*/

    });

});