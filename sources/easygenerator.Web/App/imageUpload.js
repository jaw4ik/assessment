import notify from 'notify';
import localizationManager from 'localization/localizationManager';
import fileUpload from 'fileUpload';
import $ from 'jquery';
import constants from 'constants';

const imageServiceUploadUrl = `${constants.imageService.host}/image/upload`;

class ImageUploader {
    static async upload() {
        try {
            let header = await window.auth.getHeader('api');
            let response = await fileUpload.xhr2(imageServiceUploadUrl, file, header);
            if (response && response.success) {
                return res;
            }
        } catch (e) {
            let resourceKey = 'imageUploadError';
            if (e && e.srcElement) {
                resourceKey = ImageUploader._getErrorResourceKey(e.srcElement.status);
            }
            throw localizationManager.localize(resourceKey);
        }
    }
    static async upload2(options){
        let defaults = {
            startLoading: () => {},
            success: () => {},
            error: () => {},
            complete: () => {}
        };

        let settings = $.extend({}, defaults, options);
        await fileUpload.upload({
            action: 'storage/image/upload',
            supportedExtensions: ['jpg','jpeg','png','gif','bmp'],
            notSupportedFileMessage: localizationManager.localize('imageIsNotSupported'),
            startLoading: settings.startLoading,
            success: data => {
                let obj = JSON.parse(data);
                if(obj.data && obj.data.url){
                    settings.success(obj.data.url);
                } else {
                    settings.error();
                }
            },
            error: event => {
                let resourceKey = 'imageUploadError';
                if (event && event.status) {
                    resourceKey = this._getErrorResourceKey(event.status);
                }
                notify.error(localizationManager.localize(resourceKey));
                settings.error();
            },
            complete: settings.complete
        });
    }
    static async v2(file) {
        try {
            let header = await window.auth.getHeader('api');
            let response = await fileUpload.xhr2(imageServiceUploadUrl, file, header);
            if (response && response.success) {
                let res = await saveImageDataCommand.execute(response.data.id, response.data.filename);
                return res;
            }
        } catch (e) {
            let resourceKey = 'imageUploadError';
            if (e && e.srcElement) {
                resourceKey = ImageUploader._getErrorResourceKey(e.srcElement.status);
            }
            throw localizationManager.localize(resourceKey);
        }
    }
    static _getErrorResourceKey(status) {
        switch (status) {
            case 400:
                return 'imageUploadError';
            case 413:
                return 'imageSizeIsTooLarge';
            default:
                return 'imageUploadError';
        }
    }
}

export default ImageUploader;