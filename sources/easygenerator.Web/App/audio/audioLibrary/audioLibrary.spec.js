import viewModel from './audioLibrary';

import constants from 'constants';
import userContext from 'userContext';
import eventTracker from 'eventTracker';
import notify from 'notify';
import audioDialog from 'dialogs/video/video';
import getAudiosCommand from 'audio/queries/getCollection';
import upgradeDialog from 'widgets/upgradeDialog/viewmodel';
import audioUploadDispatcher from 'audio/audioUploadDispatcher';
import deleteAudioCommand from 'audio/vimeo/commands/delete';

var events = {
    deleteAudioFromLibrary: 'Delete audio from library'
}

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

    describe('showDeleteAudioConfirmation', () => {

        it('should be function', () => {
            expect(viewModel.showDeleteAudioConfirmation).toBeFunction();
        });

        it('should hide delete audio confirmations for other audios', () => {
            let audio1 = { isDeleteConfirmationShown: ko.observable(true) };
            let audio2 = { isDeleteConfirmationShown: ko.observable(false) };
            viewModel.audios([audio1, audio2]);
            viewModel.showDeleteAudioConfirmation(audio2);
            expect(audio1.isDeleteConfirmationShown()).toBeFalsy();
        });

        it('should show delete audio confirmations for current audio', () => {
            let audio1 = { isDeleteConfirmationShown: ko.observable(true) };
            let audio2 = { isDeleteConfirmationShown: ko.observable(false) };
            viewModel.audios([audio1, audio2]);
            viewModel.showDeleteAudioConfirmation(audio2);
            expect(audio2.isDeleteConfirmationShown()).toBeTruthy();
        });

    });

    describe('hideDeleteAudioConfirmation', () => {

        it('should be function', () => {
            expect(viewModel.hideDeleteAudioConfirmation).toBeFunction();
        });

        it('should hide delete audio confirmation for current audio', () => {
            let audio1 = { isDeleteConfirmationShown: ko.observable(true) };
            let audio2 = { isDeleteConfirmationShown: ko.observable(false) };
            viewModel.audios([audio1, audio2]);
            viewModel.hideDeleteAudioConfirmation(audio1);
            expect(audio1.isDeleteConfirmationShown()).toBeFalsy();
        });

    });

    describe('deleteAudio', () => {

        let audio1,
            audio2;

        beforeEach(() => {
            spyOn(eventTracker, 'publish');
            spyOn(deleteAudioCommand, 'execute').and.returnValue(Promise.resolve());
            spyOn(notify, 'saved');
            audio1 = { id: 1, isDeleteConfirmationShown: ko.observable(true) };
            audio2 = { id: 2, isDeleteConfirmationShown: ko.observable(false) };
            viewModel.audios([audio1, audio2]);
        });

        it('should be function', () => {
            expect(viewModel.deleteAudio).toBeFunction();
        });

        it('should publish event', () => {
            viewModel.deleteAudio(audio1);
            expect(eventTracker.publish).toHaveBeenCalledWith(events.deleteAudioFromLibrary);
        });
        
        it('should execute delete audio command', () => {
            viewModel.deleteAudio(audio1);
            expect(deleteAudioCommand.execute).toHaveBeenCalledWith(audio1.id);
        });

        describe('and delete command has been executed successfuly', () => {

            it('should remove audio from list', done => (async () => {
                await viewModel.deleteAudio(audio1);
                expect(viewModel.audios().length).toBe(1);
                expect(viewModel.audios()[0]).toBe(audio2);
            })().then(done));

            it('should show notification message', done => (async () => {
                await viewModel.deleteAudio(audio1);
                expect(notify.saved).toHaveBeenCalled();
            })().then(done));

            it('should hide delete confirmation for current audio', done => (async () => {
                await viewModel.deleteAudio(audio1);
                expect(audio1.isDeleteConfirmationShown()).toBeFalsy();
            })().then(done));

        });

    });

});
