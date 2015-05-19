define(['./vimeo', './storage', 'constants'], function (vimeoCommands, storageCommands, constants) {

    return {
        build: build
    }

    function build(uploadUrl, fileSize, video, videoFileLoadedCallback) {
        var progressHandler = {

            id: video.id,
            updatedOn: new Date(),
            handler: function () {
                return vimeoCommands.verifyUpload(uploadUrl).then(function (range) {

                    video.progress = getUploadProgress(range, fileSize);

                    if (video.progress >= 100) {
                        videoFileLoadedCallback(video.id);
                    }

                    if (new Date() - this.updatedOn > constants.messages.storage.video.updateUploadTimeout) {
                        this.updatedOn = new Date();
                        storageCommands.updateUploadTimeout(video.id);
                    }
                });
            }
        }

        return progressHandler;
    }

    function getUploadProgress(range, fileSize) {
        var verifyResponseRegex = /0-([\d]+)/;

        if (!verifyResponseRegex.test(range)) {
            return false;
        }

        var uploadedSize = verifyResponseRegex.exec(range)[0].substring(2);

        return uploadedSize ? Math.round(uploadedSize / fileSize * 100) : 0;
    }
});