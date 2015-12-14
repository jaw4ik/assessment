import ko from 'knockout';
import _ from 'underscore';
import constants from 'constants';
import eventTracker from 'eventTracker';
import dialog from 'widgets/dialog/viewmodel';
import audioLibrary from 'audio/audioLibrary/audioLibrary';

const events = {
    dragAndDropAduioFile: 'Drag and Drop audio file and upload',
    uploadAudioFile: 'Upload audio file',
    openChooseAudioFileDialog:'Open "choose audio file" dialog'
};

class ChooseVoiceOverDialog{
    constructor() {
        this.library = audioLibrary;
        this.callback = null;
        this.selectedAudio = ko.observable(null);
        this.isLoading = ko.observable(false);
        this.isValidationMessageShown = ko.observable(false);
    }

    show(selectedAudioVimeoId, callback) {
        this.isValidationMessageShown(false);
        this.callback = callback;
        this.selectedAudio(null);
        this.isLoading(true);
        let that = this;
        this.library.initialize().then(() => {
            if (selectedAudioVimeoId) {
                that.selectedAudio(_.find(that.library.audios(), e => e.vimeoId() === selectedAudioVimeoId));
            }

            that.isLoading(false);
        });

        dialog.show(this, constants.dialogs.chooseVoiceOver.settings);
    }

    submit() {
        if (!this.selectedAudio()) {
            this.isValidationMessageShown(true);
            return;
        }

        this.library.off();
        dialog.close();

        if (_.isFunction(this.callback)) {
            this.callback({
                title: this.selectedAudio().title,
                vimeoId: this.selectedAudio().vimeoId()
            });
        }
    }

    uploadAudio(file) {
        eventTracker.publish(events.uploadAudioFile);
        audioLibrary.addAudio(file);
    }

    uploadAudioByDragging(file) {
        eventTracker.publish(events.dragAndDropAduioFile);
        audioLibrary.addAudio(file);
    }

    onOpenFileBrowseDialog(){
        eventTracker.publish(events.openChooseAudioFileDialog);
    }

    selectAudio(audio) {
        this.selectedAudio(audio);
        if (audio) {
            this.isValidationMessageShown(false);
        }
    }

    hideValidationMessage() {
        this.isValidationMessageShown(false);
    }

    close() {
        this.library.off();
        dialog.close();
    }
}

let viewModel = new ChooseVoiceOverDialog();
export default viewModel;