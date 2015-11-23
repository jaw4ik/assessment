import ko from 'knockout';
import constants from 'constants';
import dialog from 'widgets/dialog/viewmodel';
import audioLibrary from 'audio/audioLibrary/audioLibrary';

const viewModel = {
    library: audioLibrary,
    show: show,
    callback: null,
    selectedAudio: ko.observable(null),
    selectAudio: selectAudio,
    submit: submit,
    isLoading: ko.observable(false),
    isValidationMessageShown: ko.observable(false),
    hideValidationMessage: hideValidationMessage,
    close: close
};

function show(selectedAudioVimeoId, callback) {
    viewModel.isValidationMessageShown(false);
    viewModel.callback = callback;
    viewModel.selectedAudio(null);
    viewModel.isLoading(true);

    viewModel.library.initialize().then(() => {
        viewModel.library.audios().forEach(audio => {
            if (selectedAudioVimeoId && audio.vimeoId() === selectedAudioVimeoId) {
                viewModel.selectedAudio(audio);
            }
        });

        viewModel.isLoading(false);
    });

    //todo: temporary solution
    viewModel.__moduleId__ = 'dialogs/audio/chooseVoiceOver';
    dialog.show(viewModel, constants.dialogs.chooseVoiceOver.settings);
}

function submit() {
    if (!viewModel.selectedAudio()) {
        viewModel.isValidationMessageShown(true);
        return;
    }

    dialog.close();

    if (_.isFunction(viewModel.callback)) {
        viewModel.callback({
            title: viewModel.selectedAudio().title,
            vimeoId: viewModel.selectedAudio().vimeoId()
        });
    }
}

function selectAudio(audio) {
    viewModel.selectedAudio(audio);
    if (audio) {
        viewModel.isValidationMessageShown(false);
        return;
    }
}

function hideValidationMessage() {
    viewModel.isValidationMessageShown(false);
}

function close() {
    dialog.close();
}

export default viewModel;
export var __useDefault = true;