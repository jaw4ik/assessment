import storageHttpWrapper from 'http/storageHttpWrapper';
import dataContext from 'dataContext';
import userContext from 'userContext';
import constants from 'constants';
import app from 'durandal/app';

async function deleteVideo (videoId) {
    await storageHttpWrapper.post(constants.storage.host + constants.storage.video.deleteUrl, { mediaId: videoId });
    dataContext.videos = _.reject(dataContext.videos, (video) => {
        return video.id === videoId;
    });

    await userContext.identifyStoragePermissions();
    app.trigger(constants.storage.changesInQuota);
    app.trigger(constants.storage.video.changesInUpload);
}

export default deleteVideo;

 