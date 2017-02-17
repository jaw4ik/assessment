import _ from 'underscore';
import constants from 'constants';
import localizationManager from 'localization/localizationManager';
import fileUpload from 'fileUpload';

const imageServiceUploadUrl = `${constants.imageService.host}/image/upload`;
const maxFileSize = 10 * 1024 * 1024;
const allowedFileExtensions = ['jpeg', 'jpg', 'png', 'gif', 'bmp'];

async function execute(file, optionalData) {
    let fileExtension = file.name.split('.').pop().toLowerCase();
    let resourceKey = 'imageUploadError';

    if (!_.contains(allowedFileExtensions, fileExtension)) {
        resourceKey = getResourceKey(400);
        throw localizationManager.localize(resourceKey);
    }

    if (file.size > maxFileSize) {
        resourceKey = getResourceKey(413);
        throw localizationManager.localize(resourceKey);
    }

    try {
        let header = await window.auth.getHeader('api');
        return await fileUpload.xhr2(imageServiceUploadUrl, file, header, optionalData);
    } catch (e) {
        if (e && e.srcElement) {
            resourceKey = getResourceKey(e.srcElement.status);
        }
        throw localizationManager.localize(resourceKey);
    }
}

function getResourceKey(status) {
    switch (status) {
        case 400:
            return 'imageUploadError';
        case 413:
            return 'imageSizeIsTooLarge';
        default:
            return 'imageUploadError';
    }
}

export default { execute };