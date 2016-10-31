﻿define(['constants'], function (constants) {

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
            url: constants.storage.video.vimeoUrl + constants.storage.video.vimeoOembedUrl + '?url=' + encodeURIComponent(constants.storage.video.vimeoUrl + '/' + id) + '&width=200&height=113',
            method: 'GET',
            global: false
        }).then(function (response) {
            if (response && response.thumbnail_url) {
                deferred.resolve(response.thumbnail_url);
                return;
            }
            deferred.resolve(constants.storage.video.defaultThumbnailUrl);
        }).fail(function () {
            deferred.resolve(constants.storage.video.defaultThumbnailUrl);
        });

        return deferred.promise;
    }
});