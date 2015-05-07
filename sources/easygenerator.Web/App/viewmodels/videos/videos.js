define(['eventTracker', 'repositories/videoRepository', 'dialogs/video/video'], function (eventTracker, repository, videoPopup) {
    "use strict";

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
        
    }

    function showVideoPopup(video) {
        videoPopup.show(video.videoIframe);
    }

    function activate() {
        return repository.getCollection().then(function (videos) {
            viewModel.videos([]);
            _.each(videos, function (video) {
                viewModel.videos.push(video);
            });
        });
    }
});