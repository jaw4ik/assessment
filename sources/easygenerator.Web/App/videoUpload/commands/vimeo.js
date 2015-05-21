define(['constants'], function (constants) {

    return {
        putFile: putFile,
        verifyUpload: verifyUpload
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
            if (request.status != constants.messages.storage.video.vimeoVerifyStatus) {
                deferred.reject();
                return;
            }
            deferred.resolve(request.getResponseHeader('Range'));
        });

        return deferred.promise();
    }
});