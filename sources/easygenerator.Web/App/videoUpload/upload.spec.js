import videoUpload from './upload';

import storageCommands from './commands/storage';
import vimeoCommands from './commands/vimeo';
import uploadDataContext from './uploadDataContext';
import constants from 'constants';
import app from 'durandal/app';
import notify from 'notify';
import userContext from 'userContext';
import eventTracker from 'eventTracker';
import settings from 'videoUpload/settings';

describe('[videoUpload]', () => {

    it('should be function', () => {
        expect(videoUpload).toBeFunction();
    });

    describe('upload', () => {

        var storageCommandsgetTicketDefer,
            storageCommandsfinishUploadDefer,
            storageCommandscancelUploadDefer,
            vimeoCommandsPutFileDefer,
            userContextIdentifyStoragePermissionsDefer,
            removeVideoDefer,
            file = { name: 'name.mp4', size: 100 },
            video = { id: 1, status: constants.storage.video.statuses.inProgress },
            associatedLearningContentId;

        beforeEach(() => {

            storageCommandsgetTicketDefer = Q.defer();
            storageCommandsfinishUploadDefer = Q.defer();
            storageCommandscancelUploadDefer = Q.defer();
            vimeoCommandsPutFileDefer = Q.defer();
            userContextIdentifyStoragePermissionsDefer = Q.defer();
            removeVideoDefer = Q.defer();

            spyOn(eventTracker, 'publish');
            spyOn(app, 'trigger');
            spyOn(notify, 'error');
            spyOn(storageCommands, 'getTicket').and.returnValue(storageCommandsgetTicketDefer.promise);
            spyOn(storageCommands, 'finishUpload').and.returnValue(storageCommandsfinishUploadDefer.promise);
            spyOn(storageCommands, 'cancelUpload').and.returnValue(storageCommandscancelUploadDefer.promise);
            spyOn(vimeoCommands, 'putFile').and.returnValue(vimeoCommandsPutFileDefer.promise);
            spyOn(userContext, 'identifyStoragePermissions').and.returnValue(userContextIdentifyStoragePermissionsDefer.promise);
            spyOn(uploadDataContext, 'saveVideo').and.returnValue(video);
            spyOn(uploadDataContext, 'removeVideo').and.returnValue(removeVideoDefer.promise);
            spyOn(uploadDataContext, 'uploadChanged');
            spyOn(uploadDataContext, 'addToUploadQueue');
            spyOn(uploadDataContext, 'removeFromUploadQueue');

        });

        
        it('should return promise', () => {
            expect(videoUpload(file, settings)).toBePromise();
        });

        it('should publish event', () => {
            videoUpload(file, settings);
            expect(eventTracker.publish).toHaveBeenCalledWith('Upload video file', 'Video library');
        });

        it('should return promise', () => {
            expect(videoUpload(file, settings)).toBePromise();
        });

        it('should get ticket', () => {
            videoUpload(file, settings);
            expect(storageCommands.getTicket).toHaveBeenCalledWith(file.size, 'name');
        });

        describe('when get ticket query failed', () => {

            describe('and status is 403', () => {

                beforeEach(() => {
                    storageCommandsgetTicketDefer.reject(403);
                });

                it('should show notification error with not anought space message', function (done) {
                    var promise = videoUpload(file, settings);

                    promise.fin(() => {
                        expect(notify.error).toHaveBeenCalledWith(settings.notAnoughSpaceMessage);
                        done();
                    });

                });

            });

            describe('and status is not 403', () => {

                beforeEach(() => {
                    storageCommandsgetTicketDefer.reject(500);
                });

                it('should show notification error with upload error message', function (done) {
                    var promise = videoUpload(file, settings);

                    promise.fin(() => {
                        expect(notify.error).toHaveBeenCalledWith(settings.uploadErrorMessage);
                        done();
                    });

                });

            });

        });

        describe('when get ticket query successful', () => {

            var data = {
                uploadUrl: '123',
                videoId: 1
            };

            beforeEach(() => {
                storageCommandsgetTicketDefer.resolve(data);
                userContextIdentifyStoragePermissionsDefer.resolve();
            });

            it('should save video to data context', function (done) {
                vimeoCommandsPutFileDefer.resolve();
                storageCommandsfinishUploadDefer.resolve(123);

                var promise = videoUpload(file, settings, associatedLearningContentId);

                promise.fin(() => {
                    expect(uploadDataContext.saveVideo).toHaveBeenCalledWith(data.videoId, 'name', associatedLearningContentId);
                    done();
                });

            });

            it('should identify storage permissions', function (done) {
                vimeoCommandsPutFileDefer.resolve();
                storageCommandsfinishUploadDefer.resolve(123);

                var promise = videoUpload(file, settings);

                promise.fin(() => {
                    expect(userContext.identifyStoragePermissions).toHaveBeenCalledWith();
                    done();
                });

            });

            it('should trigger changes in quota event', function (done) {
                vimeoCommandsPutFileDefer.resolve();
                storageCommandsfinishUploadDefer.resolve(123);

                var promise = videoUpload(file, settings);

                promise.fin(() => {
                    expect(app.trigger).toHaveBeenCalledWith(constants.storage.changesInQuota);
                    done();
                });

            });

            it('should put file to vimeo', function (done) {
                vimeoCommandsPutFileDefer.resolve();
                storageCommandsfinishUploadDefer.resolve(123);

                var promise = videoUpload(file, settings);

                promise.fin(() => {
                    expect(vimeoCommands.putFile).toHaveBeenCalledWith(data.uploadUrl, file);
                    done();
                });

            });

            describe('and put query is failed', () => {

                beforeEach(() => {
                    vimeoCommandsPutFileDefer.reject();
                    storageCommandscancelUploadDefer.resolve();
                    storageCommandsfinishUploadDefer.resolve(123);
                });

                it('should remove upload from upload queue', function (done) {

                    var promise = videoUpload(file, settings);

                    promise.fin(() => {
                        expect(uploadDataContext.removeFromUploadQueue).toHaveBeenCalledWith(data.videoId);
                        done();
                    });

                });

                it('should show notification error', function (done) {

                    var promise = videoUpload(file, settings);

                    promise.fin(() => {
                        expect(notify.error).toHaveBeenCalledWith(settings.uploadErrorMessage);
                        done();
                    });

                });

                it('should set video status to failed', function (done) {

                    var promise = videoUpload(file, settings);

                    promise.fin(() => {
                        expect(video.status).toBe(constants.storage.video.statuses.failed);
                        done();
                    });

                });

                it('should set upload changes to true', function (done) {

                    var promise = videoUpload(file, settings);

                    promise.fin(() => {
                        expect(uploadDataContext.uploadChanged).toHaveBeenCalledWith(true);
                        done();
                    });

                });

                it('should remove video from data context', function (done) {

                    var promise = videoUpload(file, settings);

                    promise.fin(() => {
                        expect(uploadDataContext.removeVideo).toHaveBeenCalledWith(video.id, constants.storage.video.removeVideoAfterErrorTimeout);
                        done();
                    });

                });

                it('should cancel upload', function (done) {

                    var promise = videoUpload(file, settings);

                    promise.fin(() => {
                        expect(storageCommands.cancelUpload).toHaveBeenCalledWith(video.id);
                        done();
                    });

                });

                it('should identify storage permissions after cancel upload', function (done) {

                    var promise = videoUpload(file, settings);

                    promise.fin(() => {
                        expect(userContext.identifyStoragePermissions.calls.count()).toBe(2);
                        done();
                    });

                });

                it('should trigger changes in quota event after identify storage permissions and cancel upload', function (done) {

                    var promise = videoUpload(file, settings);

                    promise.fin(() => {
                        expect(app.trigger).toHaveBeenCalledWith(constants.storage.changesInQuota);
                        done();
                    });

                });

            });

            describe('and put query is successful', function() {

                beforeEach(function() {
                    vimeoCommandsPutFileDefer.resolve();
                    storageCommandscancelUploadDefer.resolve();
                });

                it('should remove upload from upload queue', function (done) {
                    storageCommandsfinishUploadDefer.resolve(123);

                    var promise = videoUpload(file, settings);

                    promise.fin(() => {
                        expect(uploadDataContext.removeFromUploadQueue).toHaveBeenCalledWith(data.videoId);
                        done();
                    });

                });

                it('should finish upload', function(done) {
                    storageCommandsfinishUploadDefer.resolve(123);

                    var promise = videoUpload(file, settings);

                    promise.fin(() => {
                        expect(storageCommands.finishUpload).toHaveBeenCalledWith(data.videoId);
                        done();
                    });

                });

                describe('and finish upload query is failed', function() {

                    beforeEach(() => {
                        storageCommandsfinishUploadDefer.reject();
                    });

                    it('should show notification error', function (done) {

                        var promise = videoUpload(file, settings);

                        promise.fin(() => {
                            expect(notify.error).toHaveBeenCalledWith(settings.uploadErrorMessage);
                            done();
                        });

                    });

                    it('should set video status to failed', function (done) {

                        var promise = videoUpload(file, settings);

                        promise.fin(() => {
                            expect(video.status).toBe(constants.storage.video.statuses.failed);
                            done();
                        });

                    });

                    it('should set upload changes to true', function (done) {

                        var promise = videoUpload(file, settings);

                        promise.fin(() => {
                            expect(uploadDataContext.uploadChanged).toHaveBeenCalledWith(true);
                            done();
                        });

                    });

                    it('should remove video from data context', function (done) {

                        var promise = videoUpload(file, settings);

                        promise.fin(() => {
                            expect(uploadDataContext.removeVideo).toHaveBeenCalledWith(video.id, constants.storage.video.removeVideoAfterErrorTimeout);
                            done();
                        });

                    });

                    it('should cancel upload', function (done) {

                        var promise = videoUpload(file, settings);

                        promise.fin(() => {
                            expect(storageCommands.cancelUpload).toHaveBeenCalledWith(video.id);
                            done();
                        });

                    });

                    it('should identify storage permissions after cancel upload', function (done) {

                        var promise = videoUpload(file, settings);

                        promise.fin(() => {
                            expect(userContext.identifyStoragePermissions.calls.count()).toBe(2);
                            done();
                        });

                    });

                    it('should trigger changes in quota event after identify storage permissions and cancel upload', function (done) {

                        var promise = videoUpload(file, settings);

                        promise.fin(() => {
                            expect(app.trigger).toHaveBeenCalledWith(constants.storage.changesInQuota);
                            done();
                        });

                    });

                });

                describe('and finish upload query is successful', function() {

                    beforeEach(function() {
                        storageCommandsfinishUploadDefer.resolve(123);
                    });

                    it('should set vimeoId to video', function(done) {
                            
                        var promise = videoUpload(file, settings);

                        promise.fin(() => {
                            expect(video.vimeoId).toBe(123);
                            done();
                        });

                    });

                    it('should set video status to loaded', function (done) {
                        video.status = constants.storage.video.statuses.inProgress;

                        var promise = videoUpload(file, settings);

                        promise.fin(() => {
                            expect(video.status).toBe(constants.storage.video.statuses.loaded);
                            done();
                        });

                    });

                    it('should set upload changes to true', function (done) {

                        var promise = videoUpload(file, settings);

                        promise.fin(() => {
                            expect(uploadDataContext.uploadChanged).toHaveBeenCalledWith(true);
                            done();
                        });

                    });

                });

            });

        });

    });

});
