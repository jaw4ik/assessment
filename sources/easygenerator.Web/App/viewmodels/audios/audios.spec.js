import viewModel from './audios';

import userContext from 'userContext';
import eventTracker from 'eventTracker';
import audioLibrary from 'audio/audioLibrary/audioLibrary';
import localizationManager from 'localization/localizationManager';

describe('viewModel [audios]', () => {
    beforeEach(() => {
        spyOn(audioLibrary, 'addAudio');
        spyOn(eventTracker, 'publish');
    });

    describe('storageSpaceProgressBarVisibility:', () => {
        it('should be observable', () => {
            expect(viewModel.storageSpaceProgressBarVisibility).toBeObservable();
        });
    });

    describe('availableStorageSpace:', () => {
        it('should be observable', () => {
            expect(viewModel.availableStorageSpace).toBeObservable();
        });
    });

    describe('availableStorageSpacePersentages:', () => {
        it('should be observable', () => {
            expect(viewModel.availableStorageSpacePersentages).toBeObservable();
        });
    });

    describe('library:', () => {
        it('should be defined', () => {
            expect(viewModel.library).toBe(audioLibrary);
        });
    });

    describe('deactivate:', () => {

        it('should return promise', function () {
            expect(viewModel.deactivate()).toBePromise();
        });

        it('should turn off library', function (done) {
            spyOn(viewModel.library, 'off');

            viewModel.deactivate().fin(function () {
                expect(viewModel.library.off).toHaveBeenCalled();
                done();
            });
        });
    });

    describe('uploadAudio:', () => {
        it('should publish \'Upload audio file\' event', () => {
            var file = {};
            viewModel.uploadAudio(file);
            expect(eventTracker.publish).toHaveBeenCalledWith('Upload audio file', 'Audio library');
        });

        it('should add audio to audio library', () => {
            var file = {};
            viewModel.uploadAudio(file);
            expect(audioLibrary.addAudio).toHaveBeenCalledWith(file);
        });
    });

    describe('uploadAudioByDragging:', () => {
        it('should publish \'Drag and Drop audio file and upload\' event', () => {
            var file = {};
            viewModel.uploadAudioByDragging(file);
            expect(eventTracker.publish).toHaveBeenCalledWith('Drag and Drop audio file and upload', 'Audio library');
        });

        it('should add audio to audio library', () => {
            var file = {};
            viewModel.uploadAudioByDragging(file);
            expect(audioLibrary.addAudio).toHaveBeenCalledWith(file);
        });
    });

    describe('onOpenFileBrowseDialog:', () => {
        it('should publish \'Open "choose audio file" dialog\' event', () => {
            viewModel.onOpenFileBrowseDialog();
            expect(eventTracker.publish).toHaveBeenCalledWith('Open "choose audio file" dialog', 'Audio library');
        });
    });

    describe('activate:', () => {
        let identifyStoragePermissionsDeferred = Q.defer(),
            initializeAudioLibraryDefer = Q.defer();

        beforeEach(() => {
            spyOn(audioLibrary, 'initialize').and.returnValue(initializeAudioLibraryDefer.promise);
            spyOn(userContext, 'identifyStoragePermissions').and.returnValue(identifyStoragePermissionsDeferred.promise);
            identifyStoragePermissionsDeferred.resolve();
            initializeAudioLibraryDefer.resolve();
        });

        it('should return promise', () => {
            expect(viewModel.activate()).toBePromise();
        });

        it('should identify storage permissions', done => {
            viewModel.activate().fin(() => {
                expect(userContext.identifyStoragePermissions).toHaveBeenCalled();
                done();
            });
        });

        it('should initialize audio library', done => {
            viewModel.activate().fin(() => {
                expect(audioLibrary.initialize).toHaveBeenCalled();
                done();
            });
        });

        describe('when user has free plan', () => {
            beforeEach(() => {
                spyOn(userContext, 'hasStarterAccess').and.returnValue(false);
                spyOn(userContext, 'hasPlusAccess').and.returnValue(false);
            });

            it('should not show storage space progress bar', (done) => {
                viewModel.storageSpaceProgressBarVisibility(true);
                var promise = viewModel.activate();

                promise.fin(() => {
                    expect(viewModel.storageSpaceProgressBarVisibility()).toEqual(false);
                    done();
                });
            });
        });

        describe('when user has not free plan', () => {
            beforeEach(() => {
                userContext.storageIdentity = {};
                spyOn(userContext, 'hasStarterAccess').and.returnValue(true);
                spyOn(userContext, 'hasPlusAccess').and.returnValue(true);
            });

            it('should show storage space progress bar', done => {
                viewModel.storageSpaceProgressBarVisibility(false);
                viewModel.activate().fin(() => {
                    expect(viewModel.storageSpaceProgressBarVisibility()).toEqual(true);
                    done();
                });
            });

            describe('when available storage space is greater than 1Gb', () => {
                beforeEach(() => {                    
                    userContext.storageIdentity.availableStorageSpace = 1073741825;
                    userContext.storageIdentity.totalStorageSpace = 1073741825 * 2;
                });

                it('should set available storage space in Gb', done => {
                    viewModel.activate().fin(() => {
                        expect(viewModel.availableStorageSpace()).toBe('1.0' + localizationManager.localize('gb'));
                        done();
                    });
                });

                it('should set available storage space in perseteges on progress bar', done => {
                    viewModel.activate().fin(() => {
                        expect(viewModel.availableStorageSpacePersentages()).toBe(50);
                        done();
                    });
                });
            });

            describe('when available storage space is less than 1Gb', () => {
                beforeEach(() => {
                    userContext.storageIdentity.availableStorageSpace = 1073741823;
                    userContext.storageIdentity.totalStorageSpace = 1073741823 * 2;
                });

                it('should set available storage space in Mb', done => {
                    viewModel.activate().fin(() => {
                        expect(viewModel.availableStorageSpace()).toBe('1024.0' + localizationManager.localize('mb'));
                        done();
                    });
                });

                it('should set available storage space in perseteges on progress bar', done => {
                    viewModel.activate().fin(() => {
                        expect(viewModel.availableStorageSpacePersentages()).toBe(50);
                        done();
                    });
                });
            });

        });

    });

});