define(['durandal/app', 'constants', 'eventTracker', 'userContext', 'localization/localizationManager', 'widgets/upgradeDialog/viewmodel', 'dialogs/video/video', 'audio/queries/getCollection', 'audio/factory', 'viewmodels/audios/AudioViewModel'],
function (app, constants, eventTracker, userContext, localizationManager, upgradeDialog, videoPopup, getCollection, factory, AudioViewModel) {
    "use strict";

    app.on(constants.storage.changesInQuota, setAvailableStorageSpace);

    var eventCategory = 'Audio library',
        events = {
            openUploadAudioDialog: 'Open \"choose audio file\" dialog'
        };
    var viewModel = {
        uploads: [],
        audios: ko.observableArray([]),
        storageSpaceProgressBarVisibility: ko.observable(false),
        availableStorageSpace: ko.observable(0),
        availableStorageSpacePersentages: ko.observable(0),
        statuses: constants.storage.audio.statuses,
        addAudio: addAudio,
        activate: activate,
        deactivate: deactivate,
        showAudioPopup: showAudioPopup,
        ensureCanAddAudio: ensureCanAddAudio
    };

    function activate() {
        return getCollection.execute().then(function (audios) {
            return userContext.identifyStoragePermissions().then(function () {
                viewModel.audios([]);

                _.each(viewModel.uploads, function (model) {
                    if (model.status !== constants.storage.audio.statuses.loaded) {
                        viewModel.audios.push(new AudioViewModel(model));
                    }
                });

                _.each(audios, function (audio) {
                    viewModel.audios.push(new AudioViewModel(audio));
                });

                viewModel.uploads = _.reject(viewModel.uploads, function (model) {
                    return model.status === constants.storage.audio.statuses.failed || model.status === constants.storage.audio.statuses.loaded;
                });

                setAvailableStorageSpace();
            });
        });
    }


    function deactivate() {
        return Q.fcall(function () {
            _.each(viewModel.uploads, function (model) {
                model.off();
            });
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

    function addAudio(file) {
        eventTracker.publish(events.openUploadAudioDialog, eventCategory);

        var model = factory.create(file);
        viewModel.uploads.unshift(model);
        viewModel.audios.unshift(new AudioViewModel(model));

        model.on(constants.storage.audio.statuses.failed).then(function () {
            viewModel.uploads = _.without(viewModel.uploads, model);
        });

        model.upload();
    }

    function showAudioPopup(audio) {
        if (!audio.vimeoId()) {
            return;
        }
        videoPopup.show(audio.vimeoId());
    }

    return viewModel;



    function ensureCanAddAudio() {
        if (!userContext.hasStarterAccess() || userContext.hasTrialAccess()) {
            upgradeDialog.show(constants.dialogs.upgrade.settings.audioUpload);
            return false;
        }
        return true;
    }

});