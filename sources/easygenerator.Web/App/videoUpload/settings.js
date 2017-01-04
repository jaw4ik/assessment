import constants from 'constants';
import localizationManager from 'localization/localizationManager';
import upload from 'videoUpload/upload';

export default {
    acceptedTypes: '*',
    supportedExtensions: '*',
    uploadErrorMessage: localizationManager.localize('videoUploadError'),
    notAnoughSpaceMessage: localizationManager.localize('videoUploadNotAnoughSpace'),
    startUpload: upload,
    events: { upload: constants.storage.video.changesInUpload, quota: constants.storage.changesInQuota },
    video: null
}