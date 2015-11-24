import ko from 'knockout';
import constants from 'constants';
import userContext from 'userContext';
import eventTracker from 'eventTracker';
import audioUploadDispatcher from 'audio/audioUploadDispatcher';
import AudioViewModel from 'audio/audioLibrary/AudioViewModel';
import upgradeDialog from 'widgets/upgradeDialog/viewmodel';
import getAudiosCommand from 'audio/queries/getCollection';
import audioDialog from 'dialogs/video/video';

let eventCategory = 'Audio library',
  events = {
      openUploadAudioDialog: 'Open \"choose audio file\" dialog'
  };

let viewModel = {
    audios: ko.observableArray([]),
    initialize: initialize,
    off: off,
    ensureCanAddAudio: ensureCanAddAudio,
    addAudio: addAudio,
    showAudioDetails: showAudioDetails,
    statuses: constants.storage.audio.statuses
};

function initialize(){
    viewModel.audios([]);
    return getAudiosCommand.execute().then(function (audios) {
        audios.forEach((audio) => {
            viewModel.audios.push(new AudioViewModel(audio));
        });
        
        audioUploadDispatcher.uploads.forEach((upload) => {
            viewModel.audios.push(new AudioViewModel(upload));
        });
    });
}

function off() {
    viewModel.audios().forEach(audio => audio.off());
}

function ensureCanAddAudio() {
    if (!userContext.hasStarterAccess() || userContext.hasTrialAccess()) {
        upgradeDialog.show(constants.dialogs.upgrade.settings.audioUpload);
        return false;
    }
    return true;
}

function addAudio(file) {
    eventTracker.publish(events.openUploadAudioDialog, eventCategory);

    let upload = audioUploadDispatcher.startUploading(file);
    viewModel.audios.unshift(new AudioViewModel(upload));
}

function showAudioDetails(audio) {
    if (!audio.vimeoId()) {
        return;
    }

    audioDialog.show({ vimeoId: audio.vimeoId() });
}

export default viewModel;