define(['durandal/app', 'eventTracker', 'repositories/videoRepository', 'dialogs/video/video', 'videoUpload'], function (app, eventTracker, repository, videoPopup, videoUpload) {
    "use strict";

    app.on('video upload changes', function () {
        updateVdieos();
    });


    var events = {

    }

    var viewModel = {
        videos: ko.observableArray([]),
        addVideo: addVideo,
        activate: activate,
        showVideoPopup: showVideoPopup
    }

    return viewModel;

    function addVideo() {
        videoUpload.upload({
            acceptedTypes: '*',
            supportedExtensions: ['mp4'],
            notSupportedFileMessage: 'file is not supported'
        });
    }

    function showVideoPopup(video) {
        if (!video.vimeoId) {
            return;
        }

        videoPopup.show(video.videoIframe);
    }

    function activate() {
        return repository.getCollection().then(function (videos) {
            viewModel.videos([]);
            _.each(videos, function (video) {
                viewModel.videos.push(mapVideo(video));
            });
        });
    }

    function mapVideo(item) {
        var video = {};

        video.title = item.title;
        video.thumbnailUrl = item.thumbnailUrl;
        video.videoIframe = item.videoIframe;
        video.createdOn = item.createdOn;
        video.modifiedOn = item.ModifiedOn;
        video.id = ko.observable(item.id);
        video.vimeoId = ko.observable(item.vimeoId);
        video.progress = ko.observable(item.progress || 0);

        return video;
    }

    function updateVdieos() {
        repository.getCollection().then(function (videos) {
            _.each(videos, function (video) {

                var vmVideo = _.find(viewModel.videos(), function (item) {
                    return video.id == item.id();
                });

                if (!vmVideo) {
                    viewModel.videos.push(mapVideo(video));
                } else {
                    vmVideo.progress(video.progress);
                    vmVideo.vimeoId(video.vimeoId);
                }
            });
        });
    }
});