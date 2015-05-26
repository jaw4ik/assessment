define(['videoUpload/uploadDataContext'], function (uploadDataContext) {
    "use strict";

    var constants = require('constants'),
        videoRepository = require('repositories/videoRepository'),
        Video = require('models/video'),
        progressHandler = require('videoUpload/handlers/progress'),
        videoConstants = constants.storage.video;

    describe('[uploadDataContext]', function () {

        it('should be object', function () {
            expect(uploadDataContext).toBeObject();
        });

        describe('queueUploads', function () {

            it('should be array', function () {
                expect(uploadDataContext.queueUploads).toBeArray();
            });

        });

        describe('uploadChanged', function () {

            it('should be function', function () {
                expect(uploadDataContext.uploadChanged).toBeFunction();
            });

            describe('when value is undefined', function () {

                it('should return current value', function () {
                    uploadDataContext.uploadChanged(true);
                    var uploadChanges = uploadDataContext.uploadChanged();
                    expect(uploadChanges).toBe(true);
                });

            });

            describe('when value is not undefined', function () {

                it('should set new value', function () {
                    uploadDataContext.uploadChanged(false);
                    var uploadChanges = uploadDataContext.uploadChanged(true);
                    expect(uploadChanges).toBe(true);
                });

            });

        });

        describe('saveVideo', function () {

            beforeEach(function () {
                spyOn(videoRepository, 'addVideo');
            });

            it('should be function', function () {
                expect(uploadDataContext.saveVideo).toBeFunction();
            });

            it('should create new video and save it to dataContext', function () {
                var videoId = 1,
                    title = '123';
                uploadDataContext.saveVideo(videoId, title);
                expect(videoRepository.addVideo).toHaveBeenCalledWith(new Video({
                    id: videoId,
                    title: title,
                    thumbnailUrl: videoConstants.defaultThumbnailUrl,
                    status: videoConstants.statuses.inProgress,
                    progress: 0,
                    createdOn: null,
                    modifiedOn: null,
                    vimeoId: null
                }));

            });

            it('should return created video', function () {
                var videoId = 1,
                    title = '123';
                var video = uploadDataContext.saveVideo(videoId, title);
                expect(video).toEqual(new Video({
                    id: videoId,
                    title: title,
                    thumbnailUrl: videoConstants.defaultThumbnailUrl,
                    status: videoConstants.statuses.inProgress,
                    progress: 0,
                    createdOn: null,
                    modifiedOn: null,
                    vimeoId: null
                }));

            });

        });

        describe('removeVideo', function () {

            beforeEach(function () {
                spyOn(videoRepository, 'removeVideo');
            });

            it('should be function', function () {
                expect(uploadDataContext.removeVideo).toBeFunction();
            });

            it('should return promise', function () {
                expect(uploadDataContext.removeVideo()).toBePromise();
            });

            it('should remove video from dataContext after timeout', function () {
                jasmine.clock().install();

                var videoId = 1,
                    timeout = 100;
                uploadDataContext.removeVideo(videoId, timeout);

                jasmine.clock().tick(102);

                expect(videoRepository.removeVideo).toHaveBeenCalledWith(videoId);

            });

        });

        describe('addToUploadQueue', function () {

            beforeEach(function () {
                uploadDataContext.queueUploads = [];
                spyOn(progressHandler, 'build').and.returnValue({});
            });

            it('should be function', function () {
                expect(uploadDataContext.addToUploadQueue).toBeFunction();
            });

            it('should build progress handler', function () {
                var uploadUrl = '123',
                    fileSize = 100,
                    video = { id: 1 };
                
                uploadDataContext.addToUploadQueue(uploadUrl, fileSize, video);
                expect(progressHandler.build).toHaveBeenCalledWith(uploadUrl, fileSize, video, uploadDataContext.removeFromUploadQueue);
            });

            /*it('should add created handler to uploadQueue', function () {
                var uploadUrl = '123',
                    fileSize = 100,
                    video = { id: 1 };
                
                uploadDataContext.addToUploadQueue(uploadUrl, fileSize, video);
                
                expect(uploadDataContext.queueUploads.length).toBe(1);
                expect(uploadDataContext.queueUploads[0]).toEqual({});
            });*/

        });

    });

});