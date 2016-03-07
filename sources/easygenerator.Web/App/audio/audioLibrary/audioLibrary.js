import ko from 'knockout';
import constants from 'constants';
import userContext from 'userContext';
import eventTracker from 'eventTracker';
import notify from 'notify';
import audioUploadDispatcher from 'audio/audioUploadDispatcher';
import AudioViewModel from 'audio/audioLibrary/AudioViewModel';
import upgradeDialog from 'widgets/upgradeDialog/viewmodel';
import getAudiosCommand from 'audio/queries/getCollection';
import audioDialog from 'dialogs/video/video';
import deleteAudioCommand from 'audio/vimeo/commands/delete';

var events = {
    deleteAudioFromLibrary: 'Delete audio from library'
}

class AudioLibrary{
    constructor() {
        this.audios = ko.observableArray([]);
        this.statuses = constants.storage.audio.statuses;
        this.showDeleteAudioConfirmation = this.showDeleteAudioConfirmation.bind(this);
    }

    initialize() {
        this.audios([]);
        let that = this;
        return getAudiosCommand.execute().then(function (audios) {
            audioUploadDispatcher.uploads.forEach((upload) => {
                that.audios.push(new AudioViewModel(upload));
            });

            audios.forEach((audio) => {
                that.audios.push(new AudioViewModel(audio));
            });
        });
    }

    off() {
        this.audios().forEach(audio => audio.off());
    }

    ensureCanAddAudio() {
        if (!userContext.hasStarterAccess() || userContext.hasTrialAccess()) {
            upgradeDialog.show(constants.dialogs.upgrade.settings.audioUpload);
            return false;
        }
        return true;
    }

    addAudio(file) {
        let upload = audioUploadDispatcher.startUploading(file);
        this.audios.unshift(new AudioViewModel(upload));
    }

    showAudioDetails(audio) {
        if (!audio.vimeoId()) {
            return;
        }

        audioDialog.show({ vimeoId: audio.vimeoId() });
    }

    showDeleteAudioConfirmation(audio) {
        for (let item of this.audios()) {
            this.hideDeleteAudioConfirmation(item);
        }
        audio.isDeleteConfirmationShown(true);
    }

    hideDeleteAudioConfirmation(audio) {
        audio.isDeleteConfirmationShown(false);
    }

    async deleteAudio(audio) {
        eventTracker.publish(events.deleteAudioFromLibrary);

        try {
            await deleteAudioCommand.execute(audio.id);
            viewModel.audios.remove(audio);
            notify.saved();
        } finally {
            audio.isDeleteConfirmationShown(false);
        }
    }
}

let viewModel = new AudioLibrary();
export default viewModel;