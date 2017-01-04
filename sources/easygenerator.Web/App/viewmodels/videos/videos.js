define(['durandal/app', 'routing/router', 'constants', 'eventTracker', 'repositories/videoRepository', 'dialogs/video/video',
    'videoUpload/upload', 'videoUpload/handlers/thumbnails', 'userContext', 'localization/localizationManager',
    'storageFileUploader', 'widgets/upgradeDialog/viewmodel', 'notify',
    'videoUpload/settings', 'videoUpload/models/VideoModel', 'commands/videos/index'
],

function (app, router, constants, eventTracker, repository, videoPopup, videoUpload, thumbnailLoader, userContext, localizationManager, storageFileUploader, upgradeDialog, notify, uploadSettings, VideoModel, videoCommands) {
        "use strict";

        var eventCategory = 'Video library',
            events = {
                openUploadVideoDialog: 'Open \"choose video file\" dialog',
                deleteVideoFromLibrary: 'Delete video from library'
            }

        var viewModel = {
            videos: ko.observableArray([]),
            storageSpaceProgressBarVisibility: ko.observable(false),
            availableStorageSpace: ko.observable(0),
            availableStorageSpacePersentages: ko.observable(0),
            statuses: constants.storage.video.statuses,
            addVideo: addVideo,
            storageSpace: null,
            deactivate: deactivate,
            activate: activate,
            updateVideos: updateVideos,
            showVideoPopup: showVideoPopup,
            showDeleteVideoConfirmation: showDeleteVideoConfirmation,
            hideDeleteVideoConfirmation: hideDeleteVideoConfirmation,
            deleteVideo: deleteVideo,
            uploadSubscription: null,
            quotaSubscription: null
        }

        return viewModel;

        function addVideo() {
            if (!userContext.hasStarterAccess() || userContext.hasTrialAccess()) {
                upgradeDialog.show(constants.dialogs.upgrade.settings.videoUpload);
                return;
            }
            storageFileUploader.upload(uploadSettings);
            eventTracker.publish(events.openUploadVideoDialog, eventCategory);
        }

        function showVideoPopup(video) {
            if (!video.vimeoId()) {
                return;
            }

            videoPopup.show({ vimeoId: video.vimeoId(), enableVideo: true });
        }

        function activate() {
            viewModel.uploadSubscription = app.on(uploadSettings.events.upload, updateVideos);
            viewModel.quotaSubscription = app.on(uploadSettings.events.quota, setAvailableStorageSpace);

            return userContext.identifyStoragePermissions().then(function () {
                return repository.getCollection().then(function (videos) {
                    return thumbnailLoader.getThumbnailUrls(videos).then(function () {
                        viewModel.videos([]);
                        _.each(videos, function (video) {
                            viewModel.videos.push(new VideoModel(video));
                        });
                        setAvailableStorageSpace();
                    });
                });
            });
        }

        function deactivate() {
            viewModel.uploadSubscription.off();
            viewModel.quotaSubscription.off();
        }

        function showDeleteVideoConfirmation(video) {
            video.isDeleteConfirmationShown(true);
        }

        function hideDeleteVideoConfirmation(video) {
            video.isDeleteConfirmationShown(false);
        }

        function deleteVideo(video) {
            eventTracker.publish(events.deleteVideoFromLibrary);

            video.isDeleting(true);
            videoCommands.deleteVideo(video.id)
                .then(function () {
                    viewModel.videos.remove(video);
                    notify.saved();
                }).fin(function () {
                    video.isDeleteConfirmationShown(false);
                    video.isDeleting(false);
                });
        }

        function updateVideos() {
            return repository.getCollection().then(function (videos) {
                _.each(videos, function (video) {
                    var viewModelVideo = _.find(viewModel.videos(), function (item) {
                        return video.id === item.id;
                    });

                    if (!viewModelVideo) {
                        viewModel.videos.unshift(new VideoModel(video));
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
                        return item.id === viewModelVideo.id;
                    });
                    if (!video) {
                        var index = viewModel.videos().indexOf(viewModelVideo);
                        viewModel.videos.splice(index, 1);
                    }
                });
            });
        }

        function setAvailableStorageSpace() {
            viewModel.storageSpace = videoCommands.getAvailableStorageSpace();
            if (viewModel.storageSpace) {
                viewModel.storageSpaceProgressBarVisibility(true);
                viewModel.availableStorageSpace(viewModel.storageSpace.availableStorageSpace);
                viewModel.availableStorageSpacePersentages(viewModel.storageSpace.availableStorageSpacePersentages);
            }
        }
    });