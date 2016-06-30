define(['Command', 'constants', 'http/storageHttpWrapper'], function (Command, constants, storageHttpWrapper) {
    'use strict';

    return new Command(function (audio) {
        return storageHttpWrapper.post(constants.storage.host + '/api/media/audio/update', { id: audio.id }).then(function() {
            audio.available = true;
            return audio;
        });
    });

});