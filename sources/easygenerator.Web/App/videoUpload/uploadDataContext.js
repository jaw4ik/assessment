define(['constants', 'repositories/videoRepository', './handlers/progress', 'models/video'], function (constants, repository, progressHandler, VideoModel) {

    var queueUploads = [],
        uploadChanges = false,
        videoConstants = constants.storage.video;

    return {
        queueUploads: queueUploads,
        uploadChanged: uploadChanged,
        saveVideo: saveVideo,
        removeVideo: removeVideo,
        addToUploadQueue: addToUploadQueue,
        removeFromUploadQueue: removeFromUploadQueue
    };

    function uploadChanged(value) {
        if (value !== undefined) {
            uploadChanges = value;
        }
        return uploadChanges;
    }

    function saveVideo(videoId, title) {
        var video = new VideoModel({
            id: videoId,
            title: title,
            thumbnailUrl: videoConstants.defaultThumbnailUrl,
            status: videoConstants.statuses.inProgress,
            progress: 0,
            createdOn: null,
            modifiedOn: null,
            vimeoId: null
        });

        repository.addVideo(video);
        return video;
    }

    function removeVideo(id, timeout) {
        var deferred = $.Deferred();

        setTimeout(function () {
            repository.removeVideo(id);

            deferred.resolve();
        }, timeout);

        return deferred.promise();
    }

    function addToUploadQueue(uploadUrl, fileSize, video) {
        var fileUploadedCallback = removeFromUploadQueue,
            handler = progressHandler.build(uploadUrl, fileSize, video, fileUploadedCallback);
        queueUploads.push(handler);
    }

    function removeFromUploadQueue(videoId) {
        var handlerToRemove = _.find(queueUploads, function (item) {
            return item.id == videoId;
        }),
            index = queueUploads.indexOf(handlerToRemove);
        if (index < 0) {
            return false;
        }
        queueUploads.splice(index, 1);
        return true;
    }
})