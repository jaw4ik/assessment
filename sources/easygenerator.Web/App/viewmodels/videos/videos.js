define(['durandal/app', 'plugins/router', 'constants', 'eventTracker', 'repositories/videoRepository', 'dialogs/video/video', 'videoUpload/videoUpload', 'videoUpload/thumbnailLoader', 'userContext', 'localization/localizationManager'], function (app, router, constants, eventTracker, repository, videoPopup, videoUpload, thumbnailLoader, userContext, localizationManager) {
    "use strict";

    app.on(constants.messages.storage.video.changesInUpload, function () {
        updateVdieos();
    });

    var uploadVideoEventCategory = 'Upload video',
        events = {
            upgradeNow: 'Upgrade now',
            skipUpgrade: 'Skip upgrade'
        }

    var viewModel = {
        videos: ko.observableArray([]),
        statuses: constants.messages.storage.video.statuses,
        addVideo: addVideo,
        activate: activate,
        showVideoPopup: showVideoPopup,
        upgradeToVideoUpload: upgradeToVideoUpload,
        skipUpgradeForUploadVideo: skipUpgradeForUploadVideo,
        upgradePopupVisibility: ko.observable(false),
        availableStorageSpace: ko.observable(0),
        availableStorageSpacePersentage: ko.observable(0),
        storageSpaceProgressBarVisibility: ko.observable(false)
    }

    return viewModel;

    function setAvailableStorageSpace() {
        var free = userContext.identity.availableStorageSpace,
            max = userContext.identity.totalStorageSpace,
            value = free / 1073741824;

        viewModel.availableStorageSpacePersentage(Math.round((max - free) / max * 100));

        if (value >= 1) {
            viewModel.availableStorageSpace(value.toFixed(1) + localizationManager.localize('gb'));
            return;
        }
        value = value * 1024;
        viewModel.availableStorageSpace(value.toFixed(1) + localizationManager.localize('mb'));
    }

    function addVideo() {
        if (!userContext.hasStarterAccess() && !userContext.hasPlusAccess()) {
            viewModel.upgradePopupVisibility(true);
            return;
        }
        videoUpload.upload({
            acceptedTypes: '*',
            supportedExtensions: '*',
            notSupportedFileMessage: localizationManager.localize('videoIsNotSupported'),
            notAnoughSpaceMessage: localizationManager.localize('videoUploadNotAnoughSpace')
        });
    }

    function showVideoPopup(video) {
        if (!video.vimeoId()) {
            return;
        }

        videoPopup.show(video.vimeoId());
    }

    function upgradeToVideoUpload() {
        upgradeNow(uploadVideoEventCategory);
        viewModel.upgradePopupVisibility(false);
    }

    function upgradeNow(eventCategory) {
        eventTracker.publish(events.upgradeNow, eventCategory);
        router.openUrl(constants.upgradeUrl);
    }

    function skipUpgradeForUploadVideo() {
        skipUpgrade(uploadVideoEventCategory);
        viewModel.upgradePopupVisibility(false);
    }

    function skipUpgrade(eventCategory) {
        eventTracker.publish(events.skipUpgrade, eventCategory);
    }

    function activate() {
        return userContext.identifyStoragePermissions().then(function () {
            setAvailableStorageSpace();
            return repository.getCollection().then(function (videos) {
                return thumbnailLoader.getThumbnailUrls(videos).then(function () {
                    viewModel.videos([]);
                    _.each(videos, function (video) {
                        viewModel.videos.push(mapVideo(video));
                    });
                });
            });
        });
    }

    function mapVideo(item) {
        var video = {};

        video.id = item.id;
        video.title = item.title;
        video.thumbnailUrl = ko.observable(item.thumbnailUrl);
        video.createdOn = ko.observable(item.createdOn);
        video.modifiedOn = ko.observable(item.ModifiedOn);
        video.vimeoId = ko.observable(item.vimeoId);
        video.thumbnailUrl = ko.observable(item.thumbnailUrl);
        video.progress = ko.observable(item.progress || 0);
        video.status = ko.observable(item.status || viewModel.statuses.loaded);

        return video;
    }

    function updateVdieos() {
        repository.getCollection().then(function (videos) {
            _.each(videos, function (video) {

                var vmVideo = _.find(viewModel.videos(), function (item) {
                    return video.id == item.id;
                });

                if (!vmVideo) {
                    viewModel.videos.push(mapVideo(video));
                } else {
                    vmVideo.progress(video.progress);
                    vmVideo.vimeoId(video.vimeoId);
                    vmVideo.createdOn(video.createdOn);
                    vmVideo.modifiedOn(video.modifiedOn);
                    vmVideo.thumbnailUrl(video.thumbnailUrl);
                    vmVideo.status(video.status);
                }
            });
            _.each(viewModel.videos(), function (item) {
                var video = _.find(videos, function (rpVideo) {
                    return rpVideo.id == item.id;
                });
                if (!video) {
                    var index = viewModel.videos().indexOf(item);
                    viewModel.videos().splice(index, 1);
                }
            });
        });
    }
});