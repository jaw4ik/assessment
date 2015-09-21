define(['Command', 'constants', 'http/storageHttpWrapper'], function (Command, constants, storageHttpWrapper) {
    'use strict';

    return new Command(function (file) {
        return storageHttpWrapper.post(constants.storage.host + constants.storage.audio.pullUrl, file);
    });

});