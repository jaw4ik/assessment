import app from 'durandal/app';
import constants from 'constants';
import notify from 'notify';
import storageCommands from './commands/storage';
import vimeoCommands from './commands/vimeo';
import userContext from 'userContext';
import uploadDataContext from './uploadDataContext';
import eventTracker from 'eventTracker';

let videoConstants = constants.storage.video,
    eventCategory = 'Video library',
    currentEvents = {
        uploadVideoFile: 'Upload video file'
    };
       
export default function (file, settings, associatedLearningContentId) {
    eventTracker.publish(currentEvents.uploadVideoFile, eventCategory);
    var title = getFileName(file.name);

    return storageCommands.getTicket(file.size, title)
        .then((data) => {
            return uploadVideo(file, data.uploadUrl, data.videoId, title, settings, associatedLearningContentId);
        })
        .fail((status) => {
            status === 403
                ? notify.error(settings.notAnoughSpaceMessage)
                : notify.error(settings.uploadErrorMessage);
        });
}

function uploadVideo(file, uploadUrl, videoId, title, settings, associatedLearningContentId) {
    
    let videoToUpload = uploadDataContext.saveVideo(videoId, title, associatedLearningContentId);
    
    uploadDataContext.addToUploadQueue(uploadUrl, file.size, videoToUpload);
    return userContext.identifyStoragePermissions()
        .then(() => {

            app.trigger(settings.events.quota);
            return vimeoCommands.putFile(uploadUrl, file)
                .then(() => {
                    uploadDataContext.removeFromUploadQueue(videoToUpload.id);
                    return storageCommands.finishUpload(videoToUpload.id)
                        .then((vimeoId) => {
                            videoToUpload.vimeoId = vimeoId;
                            videoToUpload.status = videoConstants.statuses.loaded;
                            uploadDataContext.uploadChanged(true);
                        })
                        .fail(() => {
                            uploadFail(videoToUpload, settings.uploadErrorMessage);
                        });
                })
                .fail(() => {
                    uploadDataContext.removeFromUploadQueue(videoToUpload.id);
                    uploadFail(videoToUpload, settings.uploadErrorMessage);
                });
        });
}

function uploadFail(video, message) {
    notify.error(message);
    video.status = videoConstants.statuses.failed;
    uploadDataContext.uploadChanged(true);
    uploadDataContext.removeVideo(video.id, videoConstants.removeVideoAfterErrorTimeout)
        .then(function() {
            uploadDataContext.uploadChanged(true);
        });
    return storageCommands.cancelUpload(video.id)
        .then(function() {
            return userContext.identifyStoragePermissions()
                .then(function() {
                    app.trigger(constants.storage.changesInQuota);
                });
        });
}

function getFileName(fileName) {
    return fileName.substring(0, fileName.lastIndexOf('.'));
}