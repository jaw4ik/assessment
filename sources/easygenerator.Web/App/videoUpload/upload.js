define(['durandal/app', 'constants', 'notify', './commands/storage', './commands/vimeo', 'userContext', 'storageFileUploader', 'videoUpload/uploadDataContext', 'eventTracker'], function (app, constants, notify, storageCommands, vimeoCommands, userContext, storageFileUploader, uploadDataContext, eventTracker) {

    var videoConstants = constants.storage.video,
        eventCategory = 'Video library',
        events = {
            uploadVideoFile: 'Upload video file'
        }

    return {
        upload: function (settings) {
            settings.startUpload = startVideoUpload;
            storageFileUploader.upload(settings);
        }
    };

    function startVideoUpload(filePath, file, settings) {
        eventTracker.publish(events.uploadVideoFile, eventCategory);
        var title = getFileName(file.name);

        return storageCommands.getTicket(file.size, title).then(function (data) {
            return uploadVideo(file, data.uploadUrl, data.videoId, title, settings);
        }).fail(function (status) {
            status == 403 ? notify.error(settings.notAnoughSpaceMessage) : notify.error(settings.uploadErrorMessage);
        });
    }

    function uploadVideo(file, uploadUrl, videoId, title, settings) {
        var videoToUpload = uploadDataContext.saveVideo(videoId, title);

        uploadDataContext.addToUploadQueue(uploadUrl, file.size, videoToUpload);

        return userContext.identifyStoragePermissions().then(function () {
            app.trigger(constants.storage.changesInQuota);
            return vimeoCommands.putFile(uploadUrl, file).then(function () {
                uploadDataContext.removeFromUploadQueue(videoToUpload.id);

                return storageCommands.finishUpload(videoToUpload.id).then(function (vimeoId) {
                    videoToUpload.vimeoId = vimeoId;
                    videoToUpload.status = videoConstants.statuses.loaded;
                    uploadDataContext.uploadChanged(true);
                }).fail(function () {
                    uploadFail(videoToUpload, settings.uploadErrorMessage);
                });
            }).fail(function () {
                uploadDataContext.removeFromUploadQueue(videoToUpload.videoId);
                uploadFail(videoToUpload, settings.uploadErrorMessage);
            });
        });
    }

    function uploadFail(video, message) {
        notify.error(message);
        video.status = videoConstants.statuses.failed;
        uploadDataContext.uploadChanged(true);
        uploadDataContext.removeVideo(video.id, videoConstants.removeVideoAfterErrorTimeout).then(function () {
            uploadDataContext.uploadChanged(true);
        });
        return storageCommands.cancelUpload(video.id).then(function () {
            return userContext.identifyStoragePermissions().then(function () {
                app.trigger(constants.storage.changesInQuota);
            });
        });
    }

    function getFileName(fileName) {
        return fileName.substring(0, fileName.lastIndexOf('.'));
    }
})