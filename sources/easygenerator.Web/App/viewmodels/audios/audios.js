import app from 'durandal/app';
import constants from 'constants';
import ko from 'knockout';
import audioLibrary from 'audio/audioLibrary/audioLibrary';
import userContext from 'userContext';
import localizationManager from 'localization/localizationManager';

app.on(constants.storage.changesInQuota, setAvailableStorageSpace);

let viewModel = {
    storageSpaceProgressBarVisibility: ko.observable(false),
    availableStorageSpace: ko.observable(0),
    availableStorageSpacePersentages: ko.observable(0),
    activate: activate,
    deactivate: deactivate,
    library: audioLibrary
};

function activate() {
    return viewModel.library.initialize().then(function() {
        return userContext.identifyStoragePermissions().then(function () {
            setAvailableStorageSpace();
        });
    });
}

function deactivate() {
    return Q.fcall(function () {
        viewModel.library.off();
    });
}

function setAvailableStorageSpace() {
    if (!userContext.hasStarterAccess() || userContext.hasTrialAccess()) {
        viewModel.storageSpaceProgressBarVisibility(false);
        return;
    }
    viewModel.storageSpaceProgressBarVisibility(true);

    var free = userContext.storageIdentity.availableStorageSpace,
        max = userContext.storageIdentity.totalStorageSpace,
        value = free / 1073741824;

    viewModel.availableStorageSpacePersentages(Math.round((max - free) / max * 100));

    if (value >= 1) {
        viewModel.availableStorageSpace(value.toFixed(1) + localizationManager.localize('gb'));
        return;
    }
    value = value * 1024;
    viewModel.availableStorageSpace(value.toFixed(1) + localizationManager.localize('mb'));
}

export default viewModel;
export var __useDefault = true;