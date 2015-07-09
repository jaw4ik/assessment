define(['constants'], function (constants) {

    return {
        putFile: putFile,
        verifyUpload: verifyUpload,
        getThumbnailUrl: getThumbnailUrl,
        getVideoDuration: getVideoDuration
    }

    function putFile(uploadUrl, file) {
        return $.ajax({
            url: uploadUrl,
            method: 'PUT',
            data: file,
            processData: false,
            contentType: false,
            global: false
        });
    }

    function verifyUpload(uploadUrl) {
        var deferred = Q.defer();

        $.ajax({
            url: uploadUrl,
            method: 'PUT',
            headers: { 'Content-Range': 'bytes */*' },
            global: false
        }).fail(function (request) {
            if (request.status != constants.storage.video.vimeoVerifyStatus) {
                deferred.reject(request.status);
                return;
            }
            deferred.resolve(request.getResponseHeader('Range'));
        });

        return deferred.promise;
    }

    function getThumbnailUrl(id) {
        var deferred = Q.defer();

        $.ajax({
            url: constants.storage.video.vimeoApiVideosUrl + id + '/pictures',
            headers: { Authorization: constants.storage.video.vimeoToken },
            method: 'GET',
            global: false
        }).then(function (response) {
            try {
                deferred.resolve(_.where(response.data[0].sizes, { width: 200, height: 150 })[0].link);
            } catch (exception) {
                deferred.resolve(constants.storage.video.defaultThumbnailUrl);
            }
        }).fail(function () {
            deferred.resolve(constants.storage.video.defaultThumbnailUrl);
        });

        return deferred.promise;
    }

    function getVideoDuration(id) {
        var deferred = Q.defer();

        $.ajax({
            url: constants.storage.video.vimeoApiVideosUrl + id,
            headers: { Authorization: constants.storage.video.vimeoToken },
            method: 'GET',
            global: false
        }).then(function (response) {
            deferred.resolve(response.duration || 0);
        }).fail(function () {
            deferred.resolve(0);
        });

        return deferred.promise;
    }
});