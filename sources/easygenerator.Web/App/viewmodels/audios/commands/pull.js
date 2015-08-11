define(['durandal/events', 'constants', 'dataContext', 'models/audio', 'fileUpload', 'http/storageHttpWrapper'], function (Events, constants, dataContext, Audio, service, storageHttpWrapper) {

    return {
        execute: execute
    };

    function execute(file) {
        return storageHttpWrapper.post(constants.storage.host + '/api/media/audio/pull', file);
    }

})