define(['notify', 'userContext'], function (notify, userContext) {
    "use strict";

    var defaultSettings = {
        supportedExtensions: '*',
        uploadErrorMessage: 'Something went wrong uploading the file. Please try again.',
        acceptedTypes: '*',
        notAnoughSpaceMessage: 'File size exceeds available free space',
        startUpload: function () { }
    };

    return {
        upload: upload
    }

    function upload(options, associatedLearningContentId, callback) {
        var settings = $.extend({}, defaultSettings, options);

        var input = $("<input>")
            .attr('type', 'file')
            .attr('name', 'file')
            .attr('accept', settings.acceptedTypes)
            .on('change', function (e) {
                var filePath = $(this).val(),
                    file = e.target.files[0],
                    isExtensionValid;

                if (settings.supportedExtensions == '*') {
                    isExtensionValid = true;
                } else {
                    var extensionValidationRegex = new RegExp('\.(' + getSupportedExtensionsRegexBody(settings.supportedExtensions) + ')$');
                    isExtensionValid = filePath.toLowerCase().match(extensionValidationRegex);
                }

                if (isExtensionValid) {
                    userContext.identifyStoragePermissions().then(function () {
                        if (file.size > userContext.storageIdentity.availableStorageSpace) {
                            notify.error(settings.notAnoughSpaceMessage);
                        } else {
                           if (_.isFunction(callback))
                                callback();
                           settings.startUpload(file, settings, associatedLearningContentId);
                        }
                    });

                } else {
                    notify.error(settings.uploadErrorMessage);
                }

                input.remove();
            })
            .hide()
            .insertAfter("body");

        input.click();
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

});