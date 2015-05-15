define(['durandal/app', 'notify', 'localization/localizationManager', 'fileUpload', 'repositories/videoRepository'], function (app, notify, localizationManager, fileUpload, repository) {

    var queueUploads = [],
        havingChanges = false;

    startUploadVerifyProgressLiveCycle();
    trackUploadChanges();

    return {
        upload: function (settings) {

            var form = $("<form>")
               .hide()
               .insertAfter("body");

            var input = $("<input>")
                .attr('accept', settings.acceptedTypes)
                .attr('type', 'file')
                .attr('name', 'file')
                .on('change', function (e) {

                    if ($(this).val().toLowerCase().match(new RegExp('\.(' + getSupportedExtensionsRegexBody(settings.supportedExtensions) + ')$'))) {
                        var file = e.target.files[0];

                        getTicket()
                            .then(function (data) {
                                uploadVideo(file, data.uploadUrl, data.completeUrl);
                            })
                            .fail(function (request) {
                                throw request.status;
                            });

                    } else {
                        notify.error(settings.notSupportedFileMessage);
                    }
                })
                .appendTo(form);

            input.click();
        }
    };

    function trackUploadChanges() {
        setTimeout(function () {

            if (havingChanges) {
                havingChanges = false;
                app.trigger('video upload changes');
            }

            trackUploadChanges();

        }, 1000);
    }

    function startUploadVerifyProgressLiveCycle() {
        setTimeout(function () {

            if (queueUploads.length) {

                var arrayPromises = [];

                _.each(queueUploads, function (executeQuery) {
                    arrayPromises.push(executeQuery.call(this));
                });

                $.when.apply($, arrayPromises).fail(function (request) {

                    if (request.status != 308) {
                        startUploadVerifyProgressLiveCycle();// TODO return or remove from promise list
                    }

                    startUploadVerifyProgressLiveCycle();
                });

            } else {
                startUploadVerifyProgressLiveCycle();
            }

        }, 1000);
    }

    function uploadVideo(file, uploadUrl, completeUrl) {
        var videoToUpload = saveToDataContext(getFileName(file.name));
        addToQueue(uploadUrl, videoToUpload, file.size);

        return $.ajax({
            url: uploadUrl,
            method: 'PUT',
            data: file,
            processData: false,
            contentType: false

        }).then(function () {
            $.ajax({
                url: 'http://localhost:888/api/upload/video/finish',
                method: 'POST',
                data: { uploadUrl: uploadUrl, completeUrl: completeUrl }
            })
            .then(function (finishData) {
                videoToUpload.id = 'dssd-sdfdf-dfdsfsd-dfssdfsdf';
                videoToUpload.vimeoId = 123454;
                havingChanges = true;
            });
        });
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

    function getTicket() {
        return $.get('http://localhost:888/api/upload/video/').then(function (data) {
            return {
                id: data.Id,
                uploadUrl: data.UploadUrl,
                completeUrl: data.CompleteUrl
            }
        });
    }

    function getFileName(fileName) {
        return fileName.substring(0, fileName.lastIndexOf('.'));
    }

    function saveToDataContext(title) {
        var video = {
            id: new Date(),
            title: title,
            vimeoId: null,
            progress: 0
        }

        repository.addVideo(video);
        return video;
    }

    function addToQueue(uploadUrl, uploadedVideo, fileSize) {

        var handleVerifyProgress = function () {

            return $.ajax({
                url: uploadUrl,
                method: 'PUT',
                headers: { 'Content-Range': 'bytes */*' }

            }).fail(function (request) {

                if (request.status != 308) {
                    return;
                }

                uploadedVideo.progress = getUploadProgress(request.getResponseHeader('Range'), fileSize);
                havingChanges = true;

                if (uploadedVideo.progress >= 100) {

                    queueUploads.splice(queueUploads.indexOf(handleVerifyProgress), 1);
                }

            });
        }

        queueUploads.push(handleVerifyProgress);
    }

    function getUploadProgress(rangeHeader, fileSize) {
        var verifyResponseRegexp = /0-([\d]+)/;

        if (!verifyResponseRegexp.test(rangeHeader)) {
            return false;
        }

        var uploadedSize = verifyResponseRegexp.exec(rangeHeader)[0].substring(2);

        return uploadedSize ? Math.round(uploadedSize / fileSize * 100) : false;
    }
})