define(['constants', 'http/storageHttpWrapper'], function (constants, storageHttpWrapper) {
    var storageConstants = constants.course.video.storage;

    return {
        getTicket: getTicket,
        finishUpload: finishUpload,
        updateUploadTimeout: updateUploadTimeout
    }

    function getTicket(fileSize) {
        return storageHttpWrapper.post(storageConstants.host + storageConstants.ticketUrl, { fileSize: fileSize }).then(function (data) {
            return {
                videoId: data.VideoId,
                uploadUrl: data.UploadUrl
            }
        });
    }

    function finishUpload(title) {
        return storageHttpWrapper.post(storageConstants.host + storageConstants.finishUrl, { title: title });
    }

    function updateUploadTimeout(id) {
        return storageHttpWrapper.post(storageConstants.host + storageConstants.loadingUrl, { id: id });
    }
});