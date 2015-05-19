define(['durandal/app', 'constants', 'notify', 'repositories/videoRepository', './commands/storage', './commands/vimeo', './commands/progressHandler', 'models/video'], function (app, constants, notify, repository, storageCommands, vimeoCommands, progressHandler, VideoModel) {

    var queueUploads = [],
        uploadChanged = false,
        videoConstants = constants.messages.storage.video;

    return {

        initialize: function () {
            startTrackUploadProgress();
            startTrackUploadChanges();
        },

        upload: function (settings) {

            var input = $("<input>")
                .attr('type', 'file')
                .attr('name', 'file')
                .attr('accept', settings.acceptedTypes)
                .on('change', function (e) {

                    var filePath = $(this).val(),
                        file = e.target.files[0];

                    var extensionValidationRegex = new RegExp('\.(' + getSupportedExtensionsRegexBody(settings.supportedExtensions) + ')$'),
                        isExtensionValid = filePath.toLowerCase().match(extensionValidationRegex);

                    if (isExtensionValid) {
                        startVideoUpload(filePath, file);
                    } else {
                        notify.error(settings.notSupportedFileMessage);
                    }

                    input.remove();
                })
                .hide()
                .insertAfter("body");

            input.click();
        }
    };

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

    function startVideoUpload(filePath, file) {
        var title = getFileName(file.name);
        return storageCommands.getTicket(file.size, title).then(function (data) {
            uploadVideo(file, data.uploadUrl, data.videoId, title);
        });
    }

    function uploadVideo(file, uploadUrl, videoId, title) {
        var videoToUpload = saveToDataContext(videoId, title);

        addToUploadQueue(uploadUrl, file.size, videoToUpload);

        return vimeoCommands.putFile(uploadUrl, file).then(function () {

            removeFromUploadQueue(videoToUpload.id);

            return storageCommands.finishUpload(videoToUpload.id).then(function (vimeoId) {
                videoToUpload.vimeoId = vimeoId;
                videoToUpload.status = videoConstants.statuses.loaded;
                uploadChanged = true;

            }).fail(function (request) {
                uploadFail(videoToUpload, 'error occurred');   //TODO error on finish
            });

        }).fail(function (request) {
            removeFromUploadQueue(videoToUpload.videoId);
            uploadFail(videoToUpload, 'error occurred');   //TODO error on put failed
        });
    }

    function addToUploadQueue(uploadUrl, fileSize, video) {
        var fileUploadedCallback = removeFromUploadQueue,
            handler = progressHandler.build(uploadUrl, fileSize, video, fileUploadedCallback);
        queueUploads.push(handler);
    }

    function removeFromUploadQueue(videoId) {
        var itemToRemove = _.find(queueUploads, function (item) {
            return item.id = videoId;
        }),
            index = queueUploads.indexOf(itemToRemove);
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
        removeFromDataContext(video.id, videoConstants.removeVideoAfterErrorTimeout).then(function () {
            uploadChanged = true;
        });
    }

    function saveToDataContext(videoId, title) {

        var video = new VideoModel({
            id: videoId,
            createdOn: null,
            modifiedOn: null,
            title: title,
            vimeoId: null,
            status: videoConstants.statuses.inProgress,
            progress: 0
        });

        repository.addVideo(video);
        return video;
    }

    function removeFromDataContext(videoId, timeout) {
        var deferred = $.Deferred();

        setTimeout(function () {
            repository.removeVideo(videoId);

            deferred.resolve();
        }, timeout);

        return deferred.promise();
    }

    function getSupportedExtensionsRegexBody(extensions) {
        var result = '';

        for (var i = 0; i < extensions.length; i++) {
            result += extensions[i];
            if (i < extensions.length - 1)
                result += '|';
        }

        return result;
    }

    function getFileName(fileName) {
        return fileName.substring(0, fileName.lastIndexOf('.'));
    }
})