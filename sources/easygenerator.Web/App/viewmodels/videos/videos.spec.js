define(['viewmodels/videos/videos'], function (viewModel) {
    "use strict";

    var app = require('durandal/app'),
        router = require('plugins/router'),
        constants = require('constants'),
        eventTracker = require('eventTracker'),
        repository = require('repositories/videoRepository'),
        videoDialog = require('dialogs/video/video'),
        videoUpload = require('videoUpload/upload'),
        thumbnailsHandler = require('videoUpload/handlers/thumbnails'),
        userContext = require('userContext'),
        localizationManager = require('localization/localizationManager'),
        storageFileUploader = require('storageFileUploader');

    describe('viewModel [videos]', function () {

        it('should be object', function () {
            expect(viewModel).toBeObject();
        });

        describe('videos', function () {

            it('should be observable array', function () {
                expect(viewModel.videos).toBeObservableArray();
            });

        });

        describe('storageSpaceProgressBarVisibility', function () {

            it('should be observable', function () {
                expect(viewModel.storageSpaceProgressBarVisibility).toBeObservable();
            });

        });

        describe('availableStorageSpace', function () {

            it('should be observable', function () {
                expect(viewModel.availableStorageSpace).toBeObservable();
            });

        });

        describe('availableStorageSpacePersentages', function () {

            it('should be observable', function () {
                expect(viewModel.availableStorageSpacePersentages).toBeObservable();
            });

        });

        describe('statuses', function () {

            it('should be object from constants', function () {
                expect(viewModel.statuses).toEqual(constants.storage.video.statuses);
            });

        });

        describe('addVideo', function () {
            var upgradeVideoUploadDialog = require('dialogs/upgrade/viewmodels/upgradeVideoUpload');

            beforeEach(function () {
                spyOn(storageFileUploader, 'upload');
                spyOn(eventTracker, 'publish');
                spyOn(upgradeVideoUploadDialog, 'show');
            });

            it('should be function', function () {
                expect(viewModel.addVideo).toBeFunction();
            });

            describe('when user has free plan', function () {
                beforeEach(function () {
                    spyOn(userContext, 'hasStarterAccess').and.returnValue(false);
                });

                it('should show upgrade popup', function () {
                    viewModel.addVideo();
                    expect(upgradeVideoUploadDialog.show).toHaveBeenCalled();
                });

                it('should not upload video', function () {
                    viewModel.addVideo();
                    expect(storageFileUploader.upload).not.toHaveBeenCalled();
                });

            });

            describe('when user has trial plan', function () {
                beforeEach(function () {
                    spyOn(userContext, 'hasStarterAccess').and.returnValue(true);
                    spyOn(userContext, 'hasTrialAccess').and.returnValue(true);
                });

                it('should show upgrade popup', function () {
                    viewModel.addVideo();
                    expect(upgradeVideoUploadDialog.show).toHaveBeenCalled();
                });

                it('should not upload video', function () {
                    viewModel.addVideo();
                    expect(storageFileUploader.upload).not.toHaveBeenCalled();
                });

            });

            describe('when user has not free plan', function () {

                beforeEach(function () {
                    spyOn(userContext, 'hasStarterAccess').and.returnValue(true);
                    spyOn(userContext, 'hasTrialAccess').and.returnValue(false);
                });

                it('should upload video', function () {
                    viewModel.addVideo();
                    expect(storageFileUploader.upload).toHaveBeenCalled();
                });

                it('should publish event', function () {
                    viewModel.addVideo();
                    expect(eventTracker.publish).toHaveBeenCalledWith('Open \"choose video file\" dialog', 'Video library');
                });

            });
        });

        describe('activate', function () {
            var identifyStoragePermissionsDeferred = Q.defer(),
                repositoryGetCollectionDeferred = Q.defer(),
                thumbnailLoaderGetThumbnailUrlsDeferred = Q.defer(),
                video = { id: 1, title: 'title', vimeoId: 'vieoId', createdOn: new Date, modifiedOn: new Date, thumbnailUrl: '123', progress: 100, status: viewModel.statuses.loaded };

            beforeEach(function () {
                spyOn(userContext, 'identifyStoragePermissions').and.returnValue(identifyStoragePermissionsDeferred.promise);
                spyOn(repository, 'getCollection').and.returnValue(repositoryGetCollectionDeferred.promise);
                spyOn(thumbnailsHandler, 'getThumbnailUrls').and.returnValue(thumbnailLoaderGetThumbnailUrlsDeferred.promise);

                identifyStoragePermissionsDeferred.resolve();
                repositoryGetCollectionDeferred.resolve([video]);
                thumbnailLoaderGetThumbnailUrlsDeferred.resolve();
            });

            it('should be function', function () {
                expect(viewModel.activate).toBeFunction();
            });

            it('should return promise', function () {
                expect(viewModel.activate()).toBePromise();
            });

            it('should identify storage permissions', function () {
                viewModel.activate();
                expect(userContext.identifyStoragePermissions).toHaveBeenCalled();
            });

            it('should get video collection', function (done) {
                var promise = viewModel.activate();

                promise.fin(function () {
                    expect(repository.getCollection).toHaveBeenCalled();
                    done();
                });

            });

            it('should load thumbnails for all videos', function (done) {
                var promise = viewModel.activate();

                promise.fin(function () {
                    expect(thumbnailsHandler.getThumbnailUrls).toHaveBeenCalledWith([video]);
                    done();
                });

            });

            it('should map all videos', function (done) {
                var promise = viewModel.activate();

                promise.fin(function () {
                    expect(viewModel.videos().length).toBe(1);
                    expect(viewModel.videos()[0].id).toBe(video.id);
                    expect(viewModel.videos()[0].vimeoId()).toBe(video.vimeoId);
                    expect(viewModel.videos()[0].createdOn()).toBe(video.createdOn);
                    expect(viewModel.videos()[0].modifiedOn()).toBe(video.modifiedOn);
                    expect(viewModel.videos()[0].thumbnailUrl()).toBe(video.thumbnailUrl);
                    expect(viewModel.videos()[0].progress()).toBe(video.progress);
                    expect(viewModel.videos()[0].status()).toBe(video.status);
                    done();
                });

            });

            describe('when user has free plan', function () {

                beforeEach(function () {
                    spyOn(userContext, 'hasStarterAccess').and.returnValue(false);
                    spyOn(userContext, 'hasPlusAccess').and.returnValue(false);
                });

                it('should not show storage space progress bar', function (done) {
                    viewModel.storageSpaceProgressBarVisibility(true);
                    var promise = viewModel.activate();

                    promise.fin(function () {
                        expect(viewModel.storageSpaceProgressBarVisibility(false));
                        done();
                    });

                });

            });

            describe('when user has not free plan', function () {

                beforeEach(function () {
                    spyOn(userContext, 'hasStarterAccess').and.returnValue(true);
                    spyOn(userContext, 'hasPlusAccess').and.returnValue(true);
                });

                it('should show storage space progress bar', function (done) {
                    viewModel.storageSpaceProgressBarVisibility(false);
                    var promise = viewModel.activate();

                    promise.fin(function () {
                        expect(viewModel.storageSpaceProgressBarVisibility(true));
                        done();
                    });

                });

                describe('when available storage space is greater than 1Gb', function () {

                    beforeEach(function () {
                        userContext.storageIdentity = {};
                        userContext.storageIdentity.availableStorageSpace = 1073741825;
                        userContext.storageIdentity.totalStorageSpace = 1073741825 * 2;
                    });

                    it('should set available storage space in Gb', function (done) {
                        var promise = viewModel.activate();

                        promise.fin(function () {
                            expect(viewModel.availableStorageSpace()).toBe('1.0' + localizationManager.localize('gb'));
                            done();
                        });

                    });

                    it('should set available storage space in perseteges on progress bar', function (done) {
                        var promise = viewModel.activate();

                        promise.fin(function () {
                            expect(viewModel.availableStorageSpacePersentages()).toBe(50);
                            done();
                        });

                    });

                });

                describe('when available storage space is less than 1Gb', function () {

                    beforeEach(function () {
                        userContext.storageIdentity = {};
                        userContext.storageIdentity.availableStorageSpace = 1073741823;
                        userContext.storageIdentity.totalStorageSpace = 1073741823 * 2;
                    });

                    it('should set available storage space in Mb', function (done) {
                        var promise = viewModel.activate();

                        promise.fin(function () {
                            expect(viewModel.availableStorageSpace()).toBe('1024.0' + localizationManager.localize('mb'));
                            done();
                        });

                    });

                    it('should set available storage space in perseteges on progress bar', function (done) {
                        var promise = viewModel.activate();

                        promise.fin(function () {
                            expect(viewModel.availableStorageSpacePersentages()).toBe(50);
                            done();
                        });

                    });

                });

            });

        });

        describe('updateVideos', function () {
            var getVideoCollectionDeferred = Q.defer(),
                video1 = {
                    id: 1,
                    title: 'title',
                    vimeoId: 'vieoId',
                    createdOn: new Date,
                    modifiedOn: new Date,
                    thumbnailUrl: '123',
                    progress: 100,
                    status: viewModel.statuses.loaded
                },
                video2 = {
                    id: 2,
                    title: 'title',
                    vimeoId: ko.observable(null),
                    createdOn: ko.observable(null),
                    modifiedOn: ko.observable(null),
                    thumbnailUrl: ko.observable(null),
                    progress: ko.observable(50),
                    status: ko.observable(viewModel.statuses.inProgress)
                },
                video3 = {
                    id: 3,
                    title: 'title',
                    vimeoId: ko.observable(null),
                    createdOn: ko.observable(null),
                    modifiedOn: ko.observable(null),
                    thumbnailUrl: ko.observable(null),
                    progress: ko.observable(80),
                    status: ko.observable(viewModel.statuses.inProgress)
                },
                video3Updated = {
                    id: 3,
                    title: 'title',
                    vimeoId: 123,
                    createdOn: 132,
                    modifiedOn: 123,
                    thumbnailUrl: 123,
                    progress: 100,
                    status: viewModel.statuses.loaded
                }

            beforeEach(function () {
                spyOn(repository, 'getCollection').and.returnValue(getVideoCollectionDeferred.promise);
                getVideoCollectionDeferred.resolve([video1, video3Updated]);
                viewModel.videos([video2, video3]);
            });

            it('should be function', function () {
                expect(viewModel.updateVideos).toBeFunction();
            });

            it('should return promise', function () {
                expect(viewModel.updateVideos()).toBePromise();
            });

            it('should apply all changes from dataContext to viewModel', function (done) {
                var promise = viewModel.updateVideos();

                promise.fin(function () {
                    expect(viewModel.videos().length).toBe(2);

                    expect(viewModel.videos()[0].id).toBe(video1.id);
                    expect(viewModel.videos()[0].title).toBe(video1.title);
                    expect(viewModel.videos()[0].vimeoId()).toBe(video1.vimeoId);
                    expect(viewModel.videos()[0].createdOn()).toBe(video1.createdOn);
                    expect(viewModel.videos()[0].modifiedOn()).toBe(video1.modifiedOn);
                    expect(viewModel.videos()[0].thumbnailUrl()).toBe(video1.thumbnailUrl);
                    expect(viewModel.videos()[0].progress()).toBe(video1.progress);
                    expect(viewModel.videos()[0].status()).toBe(video1.status);

                    expect(viewModel.videos()[1].id).toBe(video3Updated.id);
                    expect(viewModel.videos()[1].title).toBe(video3Updated.title);
                    expect(viewModel.videos()[1].vimeoId()).toBe(video3Updated.vimeoId);
                    expect(viewModel.videos()[1].createdOn()).toBe(video3Updated.createdOn);
                    expect(viewModel.videos()[1].modifiedOn()).toBe(video3Updated.modifiedOn);
                    expect(viewModel.videos()[1].thumbnailUrl()).toBe(video3Updated.thumbnailUrl);
                    expect(viewModel.videos()[1].progress()).toBe(video3Updated.progress);
                    expect(viewModel.videos()[1].status()).toBe(video3Updated.status);

                    done();
                });

            });

        });

    });

});