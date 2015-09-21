define(['Command', 'constants', 'http/storageHttpWrapper'], function (Command, constants, storageHttpWrapper) {

    return new Command(function () {
        return storageHttpWrapper.post(constants.storage.host + constants.storage.audio.ticketUrl);
    });

})