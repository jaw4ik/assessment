define(['viewmodels/audios/audios'], function (viewModel) {
    "use strict";

    var constants = require('constants'),
        eventTracker = require('eventTracker'),
        repository = require('repositories/videoRepository'),
        userContext = require('userContext'),
        localizationManager = require('localization/localizationManager'),
        storageFileUploader = require('storageFileUploader');

    describe('viewModel [audios]', function () {

        it('should be object', function () {
            expect(viewModel).toBeObject();
        });

        describe('audios:', function () {

            it('should be observable array', function () {
                expect(viewModel.audios).toBeObservableArray();
            });

        });

        describe('storageSpaceProgressBarVisibility:', function () {

            it('should be observable', function () {
                expect(viewModel.storageSpaceProgressBarVisibility).toBeObservable();
            });

        });

        describe('availableStorageSpace:', function () {

            it('should be observable', function () {
                expect(viewModel.availableStorageSpace).toBeObservable();
            });

        });

        describe('availableStorageSpacePersentages:', function () {

            it('should be observable', function () {
                expect(viewModel.availableStorageSpacePersentages).toBeObservable();
            });

        });

        describe('statuses:', function () {

            it('should be object from constants', function () {
                expect(viewModel.statuses).toEqual(constants.storage.audio.statuses);
            });

        });

        describe('addAudio:', function () {
            var upgradeDialog = require('widgets/upgradeDialog/viewmodel');

            beforeEach(function () {
                spyOn(storageFileUploader, 'upload');
                spyOn(eventTracker, 'publish');
                spyOn(upgradeDialog, 'show');
            });

            it('should be function', function () {
                expect(viewModel.addAudio).toBeFunction();
            });

            describe('when user has free plan', function () {
                beforeEach(function () {
                    spyOn(userContext, 'hasStarterAccess').and.returnValue(false);
                });

                it('should show upgrade popup', function () {
                    viewModel.addAudio();
                    expect(upgradeDialog.show).toHaveBeenCalledWith(constants.dialogs.upgrade.settings.audioUpload);
                });

                it('should not upload audio', function () {
                    viewModel.addAudio();
                    expect(storageFileUploader.upload).not.toHaveBeenCalled();
                });

            });

            describe('when user has trial plan', function () {
                beforeEach(function () {
                    spyOn(userContext, 'hasStarterAccess').and.returnValue(true);
                    spyOn(userContext, 'hasTrialAccess').and.returnValue(true);
                });

                it('should show upgrade popup', function () {
                    viewModel.addAudio();
                    expect(upgradeDialog.show).toHaveBeenCalledWith(constants.dialogs.upgrade.settings.audioUpload);
                });

                it('should not upload audio', function () {
                    viewModel.addAudio();
                    expect(storageFileUploader.upload).not.toHaveBeenCalled();
                });

            });

            describe('when user has not free plan', function () {

                beforeEach(function () {
                    spyOn(userContext, 'hasStarterAccess').and.returnValue(true);
                    spyOn(userContext, 'hasTrialAccess').and.returnValue(false);
                });

                it('should upload audio', function () {
                    viewModel.addAudio();
                    expect(storageFileUploader.upload).toHaveBeenCalled();
                });

                it('should publish event', function () {
                    viewModel.addAudio();
                    expect(eventTracker.publish).toHaveBeenCalledWith('Open \"choose audio file\" dialog', 'Audio library');
                });

            });
        });

        describe('activate:', function () {
            var identifyStoragePermissionsDeferred = Q.defer(),
                repositoryGetCollectionDeferred = Q.defer(),
                thumbnailLoaderGetThumbnailUrlsDeferred = Q.defer(),
                audio = { id: 1, title: 'title', vimeoId: 'audioId', progress: 100, status: viewModel.statuses.loaded };

            beforeEach(function () {
                spyOn(userContext, 'identifyStoragePermissions').and.returnValue(identifyStoragePermissionsDeferred.promise);
                spyOn(repository, 'getCollection').and.returnValue(repositoryGetCollectionDeferred.promise);
                
                identifyStoragePermissionsDeferred.resolve();
                repositoryGetCollectionDeferred.resolve([audio]);
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

            it('should get audio collection', function (done) {
                var promise = viewModel.activate();

                promise.fin(function () {
                    expect(repository.getCollection).toHaveBeenCalled();
                    done();
                });

            });

            it('should map all audios', function (done) {
                var promise = viewModel.activate();

                promise.fin(function () {
                    expect(viewModel.audios().length).toBe(1);
                    expect(viewModel.audios()[0].id).toBe(audio.id);
                    expect(viewModel.audios()[0].vimeoId()).toBe(audio.vimeoId);
                    expect(viewModel.audios()[0].progress()).toBe(audio.progress);
                    expect(viewModel.audios()[0].status()).toBe(audio.status);
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

        describe('updateAudios:', function () {
            var getAudioCollectionDeferred = Q.defer(),
                audio1 = {
                    id: 1,
                    title: 'title',
                    vimeoId: 'audioId',
                    progress: 100,
                    status: viewModel.statuses.loaded
                },
                audio2 = {
                    id: 2,
                    title: 'title',
                    vimeoId: ko.observable(null),
                    progress: ko.observable(50),
                    status: ko.observable(viewModel.statuses.inProgress)
                },
                audio3 = {
                    id: 3,
                    title: 'title',
                    vimeoId: ko.observable(null),
                    progress: ko.observable(80),
                    status: ko.observable(viewModel.statuses.inProgress)
                },
                audio3Updated = {
                    id: 3,
                    title: 'title',
                    vimeoId: 123,
                    progress: 100,
                    status: viewModel.statuses.loaded
                }

            beforeEach(function () {
                spyOn(repository, 'getCollection').and.returnValue(getAudioCollectionDeferred.promise);
                getAudioCollectionDeferred.resolve([audio1, audio3Updated]);
                viewModel.audios([audio2, audio3]);
            });

            it('should be function', function () {
                expect(viewModel.updateAudios).toBeFunction();
            });

            it('should return promise', function () {
                expect(viewModel.updateAudios()).toBePromise();
            });

            it('should apply all changes from dataContext to viewModel', function (done) {
                var promise = viewModel.updateAudios();

                promise.fin(function () {
                    expect(viewModel.audios().length).toBe(2);

                    expect(viewModel.audios()[0].id).toBe(audio1.id);
                    expect(viewModel.audios()[0].title).toBe(audio1.title);
                    expect(viewModel.audios()[0].vimeoId()).toBe(audio1.vimeoId);
                    expect(viewModel.audios()[0].progress()).toBe(audio1.progress);
                    expect(viewModel.audios()[0].status()).toBe(audio1.status);

                    expect(viewModel.audios()[1].id).toBe(audio3Updated.id);
                    expect(viewModel.audios()[1].title).toBe(audio3Updated.title);
                    expect(viewModel.audios()[1].vimeoId()).toBe(audio3Updated.vimeoId);
                    expect(viewModel.audios()[1].progress()).toBe(audio3Updated.progress);
                    expect(viewModel.audios()[1].status()).toBe(audio3Updated.status);

                    done();
                });

            });

        });

        describe('showAudioPopup:', function () {
            var popup = require('dialogs/video/video');

            beforeEach(function () {
                spyOn(popup, 'show');
            });

            it('should be function', function () {
                expect(viewModel.showAudioPopup).toBeFunction();
            });

            describe('when audio has vimeo identifier', function () {
                it('should show audio popup', function() {
                    viewModel.showAudioPopup({ vimeoId: ko.observable("vimeoId") });
                    expect(popup.show).toHaveBeenCalledWith("vimeoId");
                });
            });

            describe('when audio does not have vimeo identifier', function() {
                it('should not show audio popup', function () {
                    viewModel.showAudioPopup({ vimeoId: ko.observable(null) });
                    expect(popup.show).not.toHaveBeenCalled();
                });
            });
        });
    });

});