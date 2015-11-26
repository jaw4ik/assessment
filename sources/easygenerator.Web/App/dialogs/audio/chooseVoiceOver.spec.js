import viewModel from 'dialogs/audio/chooseVoiceOver';

import ko from 'knockout';
import constants from 'constants';
import dialog from 'widgets/dialog/viewmodel';
import audioLibrary from 'audio/audioLibrary/audioLibrary';

describe('dialog [chooseVoiceOver]', () => {

    var audios = [
    { title: 'Its Friday!', vimeoId: ko.observable('qwe') },
    { title: 'Hello!', vimeoId: ko.observable('asd') }];

    beforeEach(() => {
        spyOn(dialog, 'show');
        spyOn(dialog, 'close');
        spyOn(audioLibrary, 'off');
    });

    describe('selectedAudio:', () => {
        it('should be observable', () => {
            expect(viewModel.selectedAudio).toBeObservable();
        });
    });

    describe('isValidationMessageShown:', () => {
        it('should be observable', () => {
            expect(viewModel.isValidationMessageShown).toBeObservable();
        });
    });

    describe('isLoading:', () => {
        it('should be observable', () => {
            expect(viewModel.isLoading).toBeObservable();
        });
    });

    describe('library:', () => {
        it('should be defined', () => {
            expect(viewModel.library).toBe(audioLibrary);
        });
    });

    describe('selectAudio:', () => {
        it('should set selected audio', () => {
            viewModel.selectedAudio(null);
            viewModel.selectAudio(audios[0]);
            expect(viewModel.selectedAudio()).toBe(audios[0]);
        });
    });

    describe('submit:', () => {
        describe('when audio is not selected', () => {
            beforeEach(() => {
                viewModel.selectedAudio(null);
            });

            it('should set isValidationMessageShown to true', () => {
                viewModel.isValidationMessageShown(false);
                viewModel.submit();
                expect(viewModel.isValidationMessageShown()).toBeTruthy();
            });

            it('should not close dialog', () => {
                viewModel.submit();
                expect(dialog.close).not.toHaveBeenCalled();
            });
        });

        describe('when audio is selected', () => {
            beforeEach(() => {
                viewModel.selectedAudio(audios[0]);
            });

            it('should call off() for library', () => {
                viewModel.submit();
                expect(audioLibrary.off).toHaveBeenCalled();
            });

            it('should close dialog', () => {
                viewModel.submit();
                expect(dialog.close).toHaveBeenCalled();
            });

            describe('when callback is defined', () => {
                beforeEach(() => {
                    viewModel.callback = jasmine.createSpy();
                });

                it('should call callback with selected audio', () => {
                    viewModel.submit();
                    expect(viewModel.callback).toHaveBeenCalledWith({
                        title: audios[0].title,
                        vimeoId: audios[0].vimeoId()
                    });
                });
            });
        });
    });

    describe('show:', () => {

        let initializeAudioLibraryDefer = Q.defer();

        beforeEach(() => {
            spyOn(audioLibrary, 'initialize').and.returnValue(initializeAudioLibraryDefer.promise);
            initializeAudioLibraryDefer.resolve();
            audioLibrary.audios(audios);
        });

        it('should set callback', () => {
            var callback = function () { };
            viewModel.show(null, callback);
            expect(viewModel.callback).toBe(callback);
        });

        it('should set isLoading to true', () => {
            viewModel.show(null, null);
            expect(viewModel.isLoading()).toBeTruthy();
        });

        it('should set selectedAudio to null', () => {
            viewModel.selectedAudio({});
            viewModel.show(null, null);
            expect(viewModel.selectedAudio()).toBe(null);
        });

        it('should set isValidationMessageShown to false', () => {
            viewModel.show(null, null);
            expect(viewModel.isValidationMessageShown()).toBeFalsy();
        });

        it('should show dialog', () => {
            viewModel.show(null, null);
            expect(dialog.show).toHaveBeenCalledWith(viewModel, constants.dialogs.chooseVoiceOver.settings);
        });

        it('should initialize library', () => {
            viewModel.show(null, null);
            expect(viewModel.library.initialize).toHaveBeenCalled();
        });

       describe('and when audio library initialized', () => {
            it('should set isLoading to false', done => {
                viewModel.show(null, null);
                initializeAudioLibraryDefer.promise.fin(() => {
                    expect(viewModel.isLoading()).toBeFalsy();
                    done();
                });
            });

            it('should set selectedAudio if vomeoId matches', done => {
                viewModel.selectedAudio(null);
                viewModel.show(audios[0].vimeoId(), null);
                initializeAudioLibraryDefer.promise.fin(() => {
                    expect(viewModel.selectedAudio()).toBeDefined();
                    done();
                });
            });
        });
    });

    describe('close:', () => {
        it('should close dialog', () => {
            viewModel.close();
            expect(dialog.close).toHaveBeenCalled();
        });

        it('should call off() for library', () => {
            viewModel.close();
            expect(audioLibrary.off).toHaveBeenCalled();
        });
    });
});