import _ from 'underscore';
import storageHttpWrapper from 'http/storageHttpWrapper';
import userContext from 'userContext';
import constants from 'constants';
import dataContext from 'dataContext';
import app from 'durandal/app';

export default {
    async execute(audioId) {
        await storageHttpWrapper.post(constants.storage.host + constants.storage.audio.deleteUrl, { mediaId: audioId });

        dataContext.audios = _.reject(dataContext.audios, audio => audio.id === audioId);

        await userContext.identifyStoragePermissions();
        app.trigger(constants.storage.changesInQuota);
    }
}