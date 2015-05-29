define(['videoUpload/uploadTracking'], function (uploadTracking) {
    "use strict";

    var constants = require('constants'),
        uploadDataContext = require('videoUpload/uploadDataContext'),
        app = require('durandal/app'),
        videoConstants = constants.storage.video;

    describe('[uploadTracking]', function () {
        var defer = Q.defer();

        beforeEach(function () {
            spyOn(app, 'trigger');
            spyOn(Q, 'allSettled').and.returnValue(defer.promise);
        });

        it('should be object', function () {
            expect(uploadTracking).toBeObject();
        });

        describe('initialize', function () {

            beforeEach(function () {
                jasmine.clock().install();
                uploadDataContext.queueUploads = [];
            });

            afterEach(function () {
                jasmine.clock().uninstall();
            });

            it('should be function', function () {
                expect(uploadTracking.initialize).toBeFunction();
            });

            it('should start track upload changes with interval', function () {
                spyOn(uploadDataContext, 'uploadChanged').and.returnValue(false);

                uploadTracking.initialize();
                jasmine.clock().tick(videoConstants.trackChangesInUploadTimeout * 2 + 100);
                expect(uploadDataContext.uploadChanged.calls.count()).toBe(2);
            });

            describe('when upload have no changes', function () {

                it('should not trigger changes event', function () {
                    spyOn(uploadDataContext, 'uploadChanged').and.returnValue(false);

                    uploadTracking.initialize();
                    jasmine.clock().tick(videoConstants.trackChangesInUploadTimeout * 2 + 100);
                    expect(app.trigger).not.toHaveBeenCalled();
                });

            });

            describe('when upload have changes', function () {

                it('should not trigger changes event', function () {
                    spyOn(uploadDataContext, 'uploadChanged').and.returnValue(true);

                    uploadTracking.initialize();
                    jasmine.clock().tick(videoConstants.trackChangesInUploadTimeout + 100);
                    expect(app.trigger).toHaveBeenCalledWith(videoConstants.changesInUpload);
                });

            });

            it('should start track upload progress with interval', function () {
                spyOn(uploadDataContext, 'uploadChanged');

                var id = 1,
                    handler = function () {
                        return defer.promise;
                    };

                defer.resolve();

                uploadDataContext.queueUploads = [{ id: id, handler: handler }];

                uploadTracking.initialize();
                jasmine.clock().tick(videoConstants.trackChangesInUploadTimeout + 100);
                expect(Q.allSettled.calls.count()).toBe(1);
            });

            describe('when upload queue is empty', function () {

                it('should not send progress queries', function () {
                    uploadDataContext.queueUploads = [];

                    uploadTracking.initialize();
                    jasmine.clock().tick(videoConstants.trackChangesInUploadTimeout * 2 + 100);

                    expect(Q.allSettled.calls.count()).toBe(0);
                });

            });

            describe('when upload queue is not empty', function () {

                it('should send progress queries for all upload', function () {
                    spyOn(uploadDataContext, 'uploadChanged');

                    var id = 1,
                        id2 = 2,
                        handler = function () {
                            return defer.promise;
                        };

                    defer.resolve();

                    uploadDataContext.queueUploads = [{ id: id, handler: handler }, { id: id2, handler: handler }];

                    uploadTracking.initialize();
                    jasmine.clock().tick(videoConstants.trackChangesInUploadTimeout + 100);

                    expect(Q.allSettled).toHaveBeenCalled();
                    expect(uploadDataContext.uploadChanged).toHaveBeenCalled();
                });

            });

        });

    });

});