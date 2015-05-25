define(['constants'], function (constants) {

    return {
        putFile: putFile,
        verifyUpload: verifyUpload,
        getThumbnailUrl: getThumbnailUrl
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
        var deferred = $.Deferred();

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

        return deferred.promise();
    }

    function getThumbnailUrl(id) {
        var deferred = $.Deferred();

        $.ajax({
            url: constants.storage.video.thumbnailLoadUrl + id + '.json',
            method: 'GET',
            global: false
        }).then(function (data) {
            if (!data.length || !data[0]['thumbnail_medium']) {
                deferred.resolve(constants.storage.video.defaultThumbnailUrl);
                return;
            }
            deferred.resolve(data[0]['thumbnail_medium']);
        }).fail(function () {
            deferred.resolve(constants.storage.video.defaultThumbnailUrl);
        });

        return deferred.promise();
    }
});