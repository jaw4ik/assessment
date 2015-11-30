import app from 'durandal/app';
import constants from 'constants';
import ko from 'knockout';
import userContext from 'userContext';
import audioLibrary from 'audio/audioLibrary/audioLibrary';
import localizationManager from 'localization/localizationManager';

class Audios{
    constructor() {
        this.library = audioLibrary;
        this.storageSpaceProgressBarVisibility = ko.observable(false);
        this.availableStorageSpace = ko.observable(0);
        this.availableStorageSpacePersentages = ko.observable(0);
    }

    activate() {
        let that = this;
        return audioLibrary.initialize().then(() => {
            return userContext.identifyStoragePermissions().then(() => {
                that.setAvailableStorageSpace();
            });
        });
    }

    deactivate() {
        return Q.fcall(() => {
            audioLibrary.off();
        });
    }

    setAvailableStorageSpace() {
        if (!userContext.hasStarterAccess() || userContext.hasTrialAccess()) {
            this.storageSpaceProgressBarVisibility(false);
            return;
        }
        this.storageSpaceProgressBarVisibility(true);

        var free = userContext.storageIdentity.availableStorageSpace,
            max = userContext.storageIdentity.totalStorageSpace,
            value = free / 1073741824;

        this.availableStorageSpacePersentages(Math.round((max - free) / max * 100));

        if (value >= 1) {
            this.availableStorageSpace(value.toFixed(1) + localizationManager.localize('gb'));
            return;
        }
        value = value * 1024;
        this.availableStorageSpace(value.toFixed(1) + localizationManager.localize('mb'));
    }

    uploadAudio(file) {
        audioLibrary.addAudio(file);
    }
}

let viewModel = new Audios();
app.on(constants.storage.changesInQuota, viewModel.setAvailableStorageSpace);

export default viewModel;