define(['videoUpload/commands/storage'], function (storageCommands) {
    "use strict";

    var constants = require('constants'),
        storageHttpWrapper = require('http/storageHttpWrapper');

    var storageConstants = constants.storage;

    describe('[storageCommands]', function () {

        it('should be object', function () {
            expect(storageCommands).toBeObject();
        });

        describe('getTicket', function () {
            var defer;

            beforeEach(function () {
                defer = Q.defer();
                spyOn(storageHttpWrapper, 'get').and.returnValue(defer.promise);
            });

            it('should be function', function () {
                expect(storageCommands.getTicket).toBeFunction();
            });

            it('should return promise', function () {
                expect(storageCommands.getTicket()).toBePromise();
            });

            it('should send get request', function () {
                var size = 123,
                    title = '123';
                storageCommands.getTicket(size, title);

                expect(storageHttpWrapper.get).toHaveBeenCalledWith(storageConstants.host + storageConstants.video.ticketUrl, { size: size, title: title });
            });

            it('should resolve promise', function (done) {
                
                var promise = storageCommands.getTicket();
                promise.fin(function () {
                    expect(promise).toBeResolved();
                    done();
                });

                defer.resolve({
                    videoId: 0,
                    uploadUrl: ''
                });

            });

        });

        describe('finishUpload', function () {
            var defer;

            beforeEach(function () {
                defer = Q.defer();
                spyOn(storageHttpWrapper, 'post').and.returnValue(defer.promise);
            });

            it('should be function', function () {
                expect(storageCommands.finishUpload).toBeFunction();
            });

            it('should return promise', function () {
                expect(storageCommands.finishUpload()).toBePromise();
            });

            it('should send post request', function () {
                var videoId = 0;
                storageCommands.finishUpload(videoId);

                expect(storageHttpWrapper.post).toHaveBeenCalledWith(storageConstants.host + storageConstants.video.finishUrl, { videoId: videoId });
            });

        });

        describe('updateUploadTimeout', function () {
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

        });

    });

});