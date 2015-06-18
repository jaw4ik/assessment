define(['durandal/app', 'constants', 'eventTracker', 'userContext', 'localization/localizationManager',
    'widgets/upgradeDialog/viewmodel', 'repositories/videoRepository', 'storageFileUploader',
    'videoUpload/upload', 'dialogs/video/video'
],
function (app, constants, eventTracker, userContext, localizationManager,
    upgradeDialog, repository, storageFileUploader, videoUpload, videoPopup) {
    "use strict";

    app.on(constants.storage.changesInQuota, setAvailableStorageSpace);
    app.on(constants.storage.audio.changesInUpload, updateAudios);

    var eventCategory = 'Audio library',
        events = {
            openUploadAudioDialog: 'Open \"choose audio file\" dialog'
        },
        uploadSettings = {
            acceptedTypes: '*',
            supportedExtensions: '*',
            uploadErrorMessage: localizationManager.localize('videoUploadError'),
            notAnoughSpaceMessage: localizationManager.localize('videoUploadNotAnoughSpace'),
            startUpload: videoUpload.upload
        }

    var viewModel = {
        audios: ko.observableArray([]),
        storageSpaceProgressBarVisibility: ko.observable(false),
        availableStorageSpace: ko.observable(0),
        availableStorageSpacePersentages: ko.observable(0),
        statuses: constants.storage.audio.statuses,
        addAudio: addAudio,
        activate: activate,
        showAudioPopup: showAudioPopup,
        updateAudios: updateAudios
    };

    function activate() {
        return userContext.identifyStoragePermissions().then(function () {
            return repository.getCollection().then(function (audios) {
                viewModel.audios([]);
                _.each(audios, function (audio) {
                    viewModel.audios.push(mapAudio(audio));
                });
                setAvailableStorageSpace();
            });
        });
    }

    function mapAudio(item) {
        var audio = {};

        audio.id = item.id;
        audio.title = item.title;
        audio.vimeoId = ko.observable(item.vimeoId);
        audio.progress = ko.observable(item.progress || 0);
        audio.status = ko.observable(item.status || viewModel.statuses.loaded);
        audio.time = "32:05";

        return audio;
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

    function addAudio() {
        if (!userContext.hasStarterAccess() || userContext.hasTrialAccess()) {
            upgradeDialog.show(constants.dialogs.upgrade.settings.audioUpload);
            return;
        }

        storageFileUploader.upload(uploadSettings);
        eventTracker.publish(events.openUploadAudioDialog, eventCategory);
    }

    function updateAudios() {
        return repository.getCollection().then(function (audios) {
            _.each(audios, function (audio) {
                var viewModelAudio = _.find(viewModel.audios(), function (item) {
                    return audio.id == item.id;
                });

                if (!viewModelAudio) {
                    viewModel.audios.unshift(mapAudio(audio));
                } else {
                    viewModelAudio.vimeoId(audio.vimeoId);
                    viewModelAudio.progress(audio.progress);
                    viewModelAudio.status(audio.status);
                }
            });
            _.each(viewModel.audios(), function (viewModelAudio) {
                var audio = _.find(audios, function (item) {
                    return item.id == viewModelAudio.id;
                });
                if (!audio) {
                    var index = viewModel.audios().indexOf(viewModelAudio);
                    viewModel.audios.splice(index, 1);
                }
            });
        });
    }

    function showAudioPopup(audio) {
        if (!audio.vimeoId()) {
            return;
        }

        videoPopup.show(audio.vimeoId());
    }

    return viewModel;
});