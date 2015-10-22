define(['viewmodels/audios/audios'], function (viewModel) {
    "use strict";

    var constants = require('constants'),
        eventTracker = require('eventTracker'),
        userContext = require('userContext'),
        localizationManager = require('localization/localizationManager'),
        getCollection = require('audio/queries/getCollection'),
        factory = require('audio/factory'),
        UploadModel = require('audio/UploadAudioModel')
    ;

    describe('viewModel [audios]', function () {

        it('should be object', function () {
            expect(viewModel).toBeObject();
        });

        describe('uploads:', function () {

            it('should be array', function () {
                expect(viewModel.uploads).toBeArray();
            });

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

        describe('ensureCanAddAudio:', function () {

            var upgradeDialog = require('widgets/upgradeDialog/viewmodel');

            beforeEach(function () {
                spyOn(upgradeDialog, 'show');
            });


            it('should be function', function () {
                expect(viewModel.ensureCanAddAudio).toBeFunction();
            });

            describe('when user has free plan', function () {
                beforeEach(function () {
                    spyOn(userContext, 'hasStarterAccess').and.returnValue(false);
                });

                it('should show upgrade popup', function () {
                    viewModel.ensureCanAddAudio();
                    expect(upgradeDialog.show).toHaveBeenCalledWith(constants.dialogs.upgrade.settings.audioUpload);
                });

                it('should return false', function () {
                    expect(viewModel.ensureCanAddAudio()).toBeFalsy();
                });

            });

            describe('when user has trial plan', function () {
                beforeEach(function () {
                    spyOn(userContext, 'hasStarterAccess').and.returnValue(true);
                    spyOn(userContext, 'hasTrialAccess').and.returnValue(true);
                });

                it('should show upgrade popup', function () {
                    viewModel.ensureCanAddAudio();
                    expect(upgradeDialog.show).toHaveBeenCalledWith(constants.dialogs.upgrade.settings.audioUpload);
                });

                it('should return false', function () {
                    expect(viewModel.ensureCanAddAudio()).toBeFalsy();
                });

            });


            describe('when user has paid plan', function () {
                beforeEach(function () {
                    spyOn(userContext, 'hasStarterAccess').and.returnValue(true);
                    spyOn(userContext, 'hasTrialAccess').and.returnValue(false);
                });
                it('should return true', function () {
                    expect(viewModel.ensureCanAddAudio()).toBeTruthy();
                });
            });
        });

        describe('addAudio:', function () {

            beforeEach(function () {
                spyOn(eventTracker, 'publish');
            });

            it('should be function', function () {
                expect(viewModel.addAudio).toBeFunction();
            });

            var file, model;

            beforeEach(function () {
                file = { name: 'sample.wav' };
                model = new UploadModel(file);

                spyOn(factory, 'create').and.returnValue(model);
                spyOn(model, 'upload');
            });


            it('should start file upload', function () {
                viewModel.addAudio(file);
                expect(model.upload).toHaveBeenCalled();
            });

            it('should add file upload view model', function () {
                viewModel.audios([]);
                viewModel.addAudio(file);
                expect(viewModel.audios().length).toEqual(1);
            });

            it('should save upload model in the background', function () {
                viewModel.uploads = [];
                viewModel.addAudio(file);

                expect(viewModel.uploads.length).toEqual(1);
            });

            it('should publish event', function () {
                viewModel.addAudio();
                expect(eventTracker.publish).toHaveBeenCalledWith('Open \"choose audio file\" dialog', 'Audio library');
            });

            describe('when upload failed', function () {

                it('should remove upload from the background', function (done) {
                    viewModel.uploads = [];
                    viewModel.addAudio(file);
                    model.on(constants.storage.audio.statuses.failed).then(function () {
                        expect(viewModel.uploads.length).toEqual(0);
                        done();
                    });
                    model.trigger(constants.storage.audio.statuses.failed);
                });

            });

        });

        describe('activate:', function () {
            var identifyStoragePermissionsDeferred = Q.defer(),
                getCollectionDeferred = Q.defer(),
                audio = { id: 1, title: 'title', vimeoId: 'audioId', progress: 100, status: viewModel.statuses.loaded, duration: 60 };

            beforeEach(function () {
                spyOn(userContext, 'identifyStoragePermissions').and.returnValue(identifyStoragePermissionsDeferred.promise);
                spyOn(getCollection, 'execute').and.returnValue(getCollectionDeferred.promise);
                identifyStoragePermissionsDeferred.resolve();
                getCollectionDeferred.resolve([audio]);
            });

            it('should be function', function () {
                expect(viewModel.activate).toBeFunction();
            });

            it('should return promise', function () {
                expect(viewModel.activate()).toBePromise();
            });

            it('should identify storage permissions', function (done) {
                viewModel.activate().then(function () {
                    expect(userContext.identifyStoragePermissions).toHaveBeenCalled();
                    done();
                });
            });

            it('should get audio collection', function (done) {
                var promise = viewModel.activate();

                promise.fin(function () {
                    expect(getCollection.execute).toHaveBeenCalled();
                    done();
                });

            });

            it('should map all audios', function (done) {
                viewModel.uploads = [];
                viewModel.audios([]);

                var promise = viewModel.activate();

                promise.fin(function () {
                    expect(viewModel.audios().length).toBe(1);
                    done();
                });

            });

            it('should add current upload in progress', function (done) {
                var model = new UploadModel({
                    name: 'sample.wav'
                });

                model.status = 'progress';

                viewModel.uploads = [model];
                viewModel.audios([]);

                viewModel.activate().then(function () {
                    expect(viewModel.audios().length).toBe(2);
                    done();
                });
            });

            it('should add upload with error', function (done) {
                var model = new UploadModel({
                    name: 'sample.wav'
                });

                model.status = 'error';

                viewModel.uploads = [model];
                viewModel.audios([]);

                viewModel.activate().then(function () {
                    expect(viewModel.audios().length).toBe(2);
                    done();
                });
            });

            it('should not add successfull upload', function (done) {
                var model = new UploadModel({
                    name: 'sample.wav'
                });

                model.status = constants.storage.audio.statuses.loaded;

                viewModel.uploads = [model];
                viewModel.audios([]);

                viewModel.activate().then(function () {
                    expect(viewModel.audios().length).toBe(1);
                    done();
                });
            });

            it('should remove all successfull uploads from the background', function (done) {
                var model = new UploadModel({
                    name: 'sample.wav'
                });

                model.status = constants.storage.audio.statuses.loaded;

                viewModel.uploads = [model];
                viewModel.audios([]);

                viewModel.activate().then(function () {
                    expect(viewModel.uploads.length).toEqual(0);
                    done();
                });
            });

            it('should remove all failed uploads from the background', function (done) {
                var model = new UploadModel({
                    name: 'sample.wav'
                });

                model.status = constants.storage.audio.statuses.failed;

                viewModel.uploads = [model];
                viewModel.audios([]);

                viewModel.activate().then(function () {
                    expect(viewModel.uploads.length).toEqual(0);
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

        describe('deactivate:', function () {

            it('should be function', function () {
                expect(viewModel.deactivate).toBeFunction();
            });

            it('should return promise', function () {
                expect(viewModel.deactivate()).toBePromise();
            });

            it('should turn off subscriptions for uploads', function (done) {
                var model1 = new UploadModel({ name: 'sample.wav' });
                var model2 = new UploadModel({ name: 'sample.mp3' });

                spyOn(model1, 'off');
                spyOn(model2, 'off');

                viewModel.uploads = [model1, model2];

                viewModel.deactivate().then(function () {
                    expect(model1.off).toHaveBeenCalledWith();
                    expect(model2.off).toHaveBeenCalledWith();
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
                it('should show audio popup', function () {
                    viewModel.showAudioPopup({ vimeoId: ko.observable("vimeoId") });
                    expect(popup.show).toHaveBeenCalledWith({ vimeoId: "vimeoId" });
                });
            });

            describe('when audio does not have vimeo identifier', function () {
                it('should not show audio popup', function () {
                    viewModel.showAudioPopup({ vimeoId: ko.observable(null) });
                    expect(popup.show).not.toHaveBeenCalled();
                });
            });
        });
    });

});