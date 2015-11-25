import ko from 'knockout';
import constants from 'constants';
import dialog from 'widgets/dialog/viewmodel';
import audioLibrary from 'audio/audioLibrary/audioLibrary';

let viewModel = {
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
        if (selectedAudioVimeoId) {
            viewModel.selectedAudio(viewModel.library.audios().find(e => e.vimeoId() === selectedAudioVimeoId));
        }

        viewModel.isLoading(false);
    });

    dialog.show(viewModel, constants.dialogs.chooseVoiceOver.settings);
}

function submit() {
    if (!viewModel.selectedAudio()) {
        viewModel.isValidationMessageShown(true);
        return;
    }

    viewModel.library.off();
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
    viewModel.library.off();
    dialog.close();
}

export default viewModel;