define(['durandal/app', 'constants', 'eventTracker', 'repositories/videoRepository', 'dialogs/video/video', 'videoUpload/videoUpload'], function (app, constants, eventTracker, repository, videoPopup, videoUpload) {
    "use strict";

    app.on('video upload changes', function () {
        updateVdieos();
    });


    var events = {

    }

    var viewModel = {
        videos: ko.observableArray([]),
        states: constants.course.video.states,
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
        if (!video.vimeoId()) {
            return;
        }

        videoPopup.show(video.vimeoId());
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

        video.id = item.id;
        video.title = item.title;
        video.thumbnailUrl = ko.observable(item.thumbnailUrl);
        video.createdOn = ko.observable(item.createdOn);
        video.modifiedOn = ko.observable(item.ModifiedOn);
        video.vimeoId = ko.observable(item.vimeoId);
        video.progress = ko.observable(item.progress || 100);
        video.state = ko.observable(item.state || viewModel.states.loaded);

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
                    vmVideo.error(video.error);
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