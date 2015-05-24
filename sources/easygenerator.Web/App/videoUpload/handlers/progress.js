define(['../commands/vimeo', '../commands/storage', 'constants'], function (vimeoCommands, storageCommands, constants) {

    return {
        build: build
    }

    function build(uploadUrl, fileSize, video, videoFileLoadedCallback) {
        var progressHandler = {

            id: video.id,
            updatedOn: new Date(),
            handler: function () {
                var self = this;
                return vimeoCommands.verifyUpload(uploadUrl).then(function (range) {

                    video.progress = getUploadProgress(range, fileSize);

                    if (video.progress >= 100) {
                        videoFileLoadedCallback(video.id);
                    }

                    if (new Date() - self.updatedOn > constants.messages.storage.video.updateUploadTimeout) {
                        self.updatedOn = new Date();
                        storageCommands.updateUploadTimeout(video.id);
                    }
                }).fail(function () {
                    video.progress = 0;
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