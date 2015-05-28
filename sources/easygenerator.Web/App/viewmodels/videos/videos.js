define(['durandal/app', 'plugins/router', 'constants', 'eventTracker', 'repositories/videoRepository', 'dialogs/video/video', 'videoUpload/upload', 'videoUpload/handlers/thumbnails', 'userContext', 'localization/localizationManager'], function (app, router, constants, eventTracker, repository, videoPopup, videoUpload, thumbnailLoader, userContext, localizationManager) {
    "use strict";

    app.on(constants.storage.video.changesInUpload, function () {
        updateVdieos();
    });

    app.on(constants.storage.changesInQuota, function () {
        setAvailableStorageSpace();
    });
   
    var eventCategory = 'Video library',
        events = {
            upgradeNow: 'Upgrade now',
            skipUpgrade: 'Skip upgrade',
            openUploadVideoDialog: 'Open \"choose video file\" dialog'
        },
        uploadSettings = {
            acceptedTypes: '*',
            supportedExtensions: '*',
            uploadErrorMessage: localizationManager.localize('videoUploadError'),
            notAnoughSpaceMessage: localizationManager.localize('videoUploadNotAnoughSpace')
        }

    var viewModel = {
        videos: ko.observableArray([]),
        upgradePopupVisibility: ko.observable(false),
        storageSpaceProgressBarVisibility: ko.observable(false),
        availableStorageSpace: ko.observable(0),
        availableStorageSpacePersentages: ko.observable(0),
        statuses: constants.storage.video.statuses,
        addVideo: addVideo,
        activate: activate,
        showVideoPopup: showVideoPopup,
        upgradeToVideoUpload: upgradeToVideoUpload,
        skipUpgradeForUploadVideo: skipUpgradeForUploadVideo
    }

    return viewModel;

    function addVideo() {
        if (!userContext.hasStarterAccess() || userContext.hasTrialAccess()) {
            viewModel.upgradePopupVisibility(true);
            return;
        }
        videoUpload.upload(uploadSettings);
        eventTracker.publish(events.openUploadVideoDialog, eventCategory);
    }

    function showVideoPopup(video) {
        if (!video.vimeoId()) {
            return;
        }

        videoPopup.show(video.vimeoId());
    }

    function upgradeToVideoUpload() {
        upgradeNow(eventCategory);
        viewModel.upgradePopupVisibility(false);
    }

    function upgradeNow(category) {
        eventTracker.publish(events.upgradeNow, category);
        router.openUrl(constants.upgradeUrl);
    }

    function skipUpgradeForUploadVideo() {
        skipUpgrade(eventCategory);
        viewModel.upgradePopupVisibility(false);
    }

    function skipUpgrade(category) {
        eventTracker.publish(events.skipUpgrade, category);
    }

    function activate() {
        return userContext.identifyStoragePermissions().then(function () {
            return repository.getCollection().then(function (videos) {
                return thumbnailLoader.getThumbnailUrls(videos).then(function () {
                    viewModel.videos([]);
                    _.each(videos, function (video) {
                        viewModel.videos.push(mapVideo(video));
                    });
                    setAvailableStorageSpace();
                });
            });
        });
    }

    function mapVideo(item) {
        var video = {};

        video.id = item.id;
        video.title = item.title;
        video.vimeoId = ko.observable(item.vimeoId);
        video.createdOn = ko.observable(item.createdOn);
        video.modifiedOn = ko.observable(item.ModifiedOn);
        video.thumbnailUrl = ko.observable(item.thumbnailUrl);
        video.progress = ko.observable(item.progress || 0);
        video.status = ko.observable(item.status || viewModel.statuses.loaded);

        return video;
    }

    function updateVdieos() {
        repository.getCollection().then(function (videos) {
            _.each(videos, function (video) {
                var viewModelVideo = _.find(viewModel.videos(), function (item) {
                    return video.id == item.id;
                });

                if (!viewModelVideo) {
                    viewModel.videos.unshift(mapVideo(video));
                } else {
                    viewModelVideo.vimeoId(video.vimeoId);
                    viewModelVideo.createdOn(video.createdOn);
                    viewModelVideo.modifiedOn(video.modifiedOn);
                    viewModelVideo.progress(video.progress);
                    viewModelVideo.thumbnailUrl(video.thumbnailUrl);
                    viewModelVideo.status(video.status);
                }
            });
            _.each(viewModel.videos(), function (viewModelVideo) {
                var video = _.find(videos, function (item) {
                    return item.id == viewModelVideo.id;
                });
                if (!video) {
                    var index = viewModel.videos().indexOf(viewModelVideo);
                    viewModel.videos.splice(index, 1);
                }
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
});