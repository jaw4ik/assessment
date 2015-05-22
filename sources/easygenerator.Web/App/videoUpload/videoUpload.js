define(['durandal/app', 'constants', 'notify', 'repositories/videoRepository', './commands/storage', './commands/vimeo', './commands/progressHandler', 'models/video', 'userContext', './mediaUploader'], function (app, constants, notify, repository, storageCommands, vimeoCommands, progressHandler, VideoModel, userContext, mediaUploader) {

    var queueUploads = [],
        uploadChanged = false,
        videoConstants = constants.messages.storage.video;

    return {

        initialize: function () {
            startTrackUploadProgress();
            startTrackUploadChanges();
        },

        upload: function (settings) {
            settings.startUpload = startVideoUpload;
            mediaUploader.upload(settings);
        }
    };

    function startVideoUpload(filePath, file) {
        var title = getFileName(file.name);
        return storageCommands.getTicket(file.size, title).then(function (data) {
            uploadVideo(file, data.uploadUrl, data.videoId, title);
        }).fail(function () {
            //TODO notify
        });
    }

    function uploadVideo(file, uploadUrl, videoId, title) {
        var videoToUpload = saveVideo(videoId, title);

        addToUploadQueue(uploadUrl, file.size, videoToUpload);

        return vimeoCommands.putFile(uploadUrl, file).then(function () {

            removeFromUploadQueue(videoToUpload.id);

            return storageCommands.finishUpload(videoToUpload.id).then(function (vimeoId) {
                videoToUpload.vimeoId = vimeoId;
                videoToUpload.status = videoConstants.statuses.loaded;
                uploadChanged = true;
            }).fail(function () {
                uploadFail(videoToUpload, 'error occurred');   //TODO error on finish
            });
        }).fail(function () {
            removeFromUploadQueue(videoToUpload.videoId);
            uploadFail(videoToUpload, settings.notSupportedFileMessage);   //TODO error on put failed
        });
    }

    function addToUploadQueue(uploadUrl, fileSize, video) {
        var fileUploadedCallback = removeFromUploadQueue,
            handler = progressHandler.build(uploadUrl, fileSize, video, fileUploadedCallback);
        queueUploads.push(handler);
    }

    function removeFromUploadQueue(videoId) {
        var handlerToRemove = _.find(queueUploads, function (item) {
            return item.id = videoId;
        }),
            index = queueUploads.indexOf(handlerToRemove);
        if (index < 0) {
            return false;
        }
        queueUploads.splice(index, 1);
        return true;
    }

    function uploadFail(video, message) {
        notify.error(message);
        video.status = videoConstants.statuses.failed;
        uploadChanged = true;
        removeVideo(video.id, videoConstants.removeVideoAfterErrorTimeout).then(function () {
            uploadChanged = true;
        });
    }

    function startTrackUploadChanges() {
        setTimeout(function () {

            if (uploadChanged) {
                uploadChanged = false;
                app.trigger(videoConstants.changesInUpload);
            }

            startTrackUploadChanges();

        }, videoConstants.trackChangesInUploadTimeout);
    }

    function startTrackUploadProgress() {
        setTimeout(function () {

            if (queueUploads.length) {
                var arrayPromises = [];

                _.each(queueUploads, function (item) {
                    arrayPromises.push(item.handler().then(function () {
                        uploadChanged = true;
                    }));
                });

                $.when.apply($, arrayPromises).then(function () {
                    startTrackUploadProgress();
                }).fail(function () {
                    startTrackUploadProgress(); //TODO notify error ?
                });

            } else {
                startTrackUploadProgress();
            }

        }, videoConstants.trackChangesInUploadTimeout);
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

    function getFileName(fileName) {
        return fileName.substring(0, fileName.lastIndexOf('.'));
    }
})