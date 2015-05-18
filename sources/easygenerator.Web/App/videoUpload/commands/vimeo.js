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
            contentType: false
        });
    }

    function verifyUpload(uploadUrl) {
        var deferred = $.Deferred();

        $.ajax({
            url: uploadUrl,
            method: 'PUT',
            headers: { 'Content-Range': 'bytes */*' }
        }).fail(function (request) {
            if (request.status != constants.course.video.vimeoVerifyStatus) {
                deferred.reject();
                return;
            }
            deferred.resolve(request.getResponseHeader('Range'));
        });

        return deferred.promise();
    }
});