import ko from 'knockout';
import constants from 'constants';
import userContext from 'userContext';
import audioUploadDispatcher from 'audio/audioUploadDispatcher';
import AudioViewModel from 'audio/audioLibrary/AudioViewModel';
import upgradeDialog from 'widgets/upgradeDialog/viewmodel';
import getAudiosCommand from 'audio/queries/getCollection';
import audioDialog from 'dialogs/video/video';

class AudioLibrary{
    constructor() {
        this.audios = ko.observableArray([]);
        this.statuses = constants.storage.audio.statuses;
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
}

let viewModel = new AudioLibrary();
export default viewModel;