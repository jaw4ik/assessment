import viewModel from './audioLibrary';

import constants from 'constants';
import userContext from 'userContext';
import audioDialog from 'dialogs/video/video';
import getAudiosCommand from 'audio/queries/getCollection';
import upgradeDialog from 'widgets/upgradeDialog/viewmodel';
import audioUploadDispatcher from 'audio/audioUploadDispatcher';

describe('viewModel [audio/audioLibrary]', () => {

    describe('audios:', () => {
        it('should be observable array', () => {
            expect(viewModel.audios).toBeObservableArray();
        });
    });

    describe('statuses:', () => {
        it('should be defined', () => {
            expect(viewModel.statuses).toBe(constants.storage.audio.statuses);
        });
    });

    describe('initialize:', () => {
        var getAudiosDefer;
        beforeEach(() => {
            getAudiosDefer = Q.defer();

            spyOn(getAudiosCommand, 'execute').and.returnValue(getAudiosDefer.promise);
        });

        describe('when audios loaded', () => {
            it('should execute command to delete source', done => {
                var audios = [{}];
                getAudiosDefer.resolve(audios);
                viewModel.initialize().fin(() => {
                    expect(getAudiosCommand.execute).toHaveBeenCalled();
                    done();
                });
            });

            it('should add pending uploads to audio collection', done => {
                let uploads = [{}];
                viewModel.audios([]);
                audioUploadDispatcher.uploads = uploads;
                getAudiosDefer.resolve([]);

                viewModel.initialize().fin(() => {
                    expect(viewModel.audios().length).toBe(1);
                    done();
                });
            });

            it('should add loaded audios to audio collection', done => {
                var audios = [{}];
                viewModel.audios([]);
                audioUploadDispatcher.uploads = [];
                getAudiosDefer.resolve(audios);

                viewModel.initialize().fin(() => {
                    expect(viewModel.audios().length).toBe(1);
                    done();
                });
            });
        });
    });

    describe('off:', () => {
        it('should call off() function for each audio', () => {
            var audio = { off: function() {} };
            viewModel.audios([audio]);
            spyOn(audio, 'off');

            viewModel.off();

            expect(audio.off).toHaveBeenCalled();
        });
    });

    describe('ensureCanAddAudio:', () => {
        beforeEach(() => {
            spyOn(upgradeDialog, 'show');
        });

        describe('when user has starter access and is not trial', () => {
            beforeEach(() => {
                spyOn(userContext, 'hasStarterAccess').and.returnValue(true);
                spyOn(userContext, 'hasTrialAccess').and.returnValue(false);
            });

            it('should return true', () => {
                expect(viewModel.ensureCanAddAudio()).toBe(true);
            });
        });

        describe('when user does not have starter access', () => {
            beforeEach(() => {
                spyOn(userContext, 'hasStarterAccess').and.returnValue(false);
            });

            it('should show upgrade dialog', () => {
                viewModel.ensureCanAddAudio();
                expect(upgradeDialog.show).toHaveBeenCalledWith(constants.dialogs.upgrade.settings.audioUpload);
            });

            it('should return false', () => {
                expect(viewModel.ensureCanAddAudio()).toBe(false);
            });
        });

        describe('when user has trial access', () => {
            beforeEach(() => {
                spyOn(userContext, 'hasTrialAccess').and.returnValue(true);
            });

            it('should show upgrade dialog', () => {
                viewModel.ensureCanAddAudio();
                expect(upgradeDialog.show).toHaveBeenCalledWith(constants.dialogs.upgrade.settings.audioUpload);
            });

            it('should return false', () => {
                expect(viewModel.ensureCanAddAudio()).toBe(false);
            });
        });
    });

    describe('addAudio:', () => {
        let file = { name: 'sample.wav' },
            upload = {};

        beforeEach(() => {
            spyOn(audioUploadDispatcher, 'startUploading').and.returnValue(upload);
        });

        it('should start uploading audio', () => {
            viewModel.addAudio(file);
            expect(audioUploadDispatcher.startUploading).toHaveBeenCalledWith(file);
        });

        it('should add audio view model to collection', () => {
            viewModel.audios([]);
            viewModel.addAudio(file);
            expect(viewModel.audios().length).toBe(1);
        });
    });

    describe('showAudioDetails:', () => {
        let audio = {
            vimeoId: ko.observable()
        };

        beforeEach(() => {
            spyOn(audioDialog, 'show');
        });

        describe('when audio vimeo id is not defined', () => {
            it('should not show audio dialog', () => {
                audio.vimeoId(null);
                viewModel.showAudioDetails(audio);
                expect(audioDialog.show).not.toHaveBeenCalled();
            });
        });

        describe('when audio vimeo id is defined', () => {
            it('should not show audio dialog', () => {
                audio.vimeoId('id');
                viewModel.showAudioDetails(audio);
                expect(audioDialog.show).toHaveBeenCalledWith({vimeoId: audio.vimeoId()});
            });
        });
    });
});
