define(['notify', 'localization/localizationManager', 'fileUpload'], function (notify, localizationManager, fileUpload) {

    return {
        upload: function (options) {
            return fileUpload.upload({
                action: '/storage/image/upload',
                supportedExtensions: ['jpg', 'jpeg', 'png', 'gif', 'bmp'],
                notSupportedFileMessage: localizationManager.localize('imageIsNotSupported'),

                startLoading: function () {
                    options.startLoading();
                },
                success: function (data) {
                    var obj = JSON.parse(data);
                    if (obj.data && obj.data.url) {
                        options.success(obj.data.url);
                    } else {
                        options.error();
                    }
                },
                error: function (event) {
                    var resourceKey = "responseFailed";

                    if (event && event.status) {
                        switch (event.status) {
                            case 400:
                                resourceKey = "imageUploadError";
                                break;
                            case 413:
                                resourceKey = "imageSizeIsTooLarge";
                                break;
                        }
                    }

                    notify.error(localizationManager.localize(resourceKey));
                    options.error();
                },
                complete: function () {
                    options.complete();
                }
            });
        }
    }
})