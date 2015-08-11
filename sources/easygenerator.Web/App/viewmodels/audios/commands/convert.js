define(['durandal/events', 'constants', 'dataContext', 'models/audio', 'fileUpload', 'http/storageHttpWrapper'], function (Events, constants, dataContext, Audio, service, storageHttpWrapper) {

    return {
        execute: execute
    };

    function execute(file) {
        return service.xhr2(file, '//adrebot.easygenerator.com/conversion').then(function (result) {
            return {
                url: result[0].url,
                duration: Math.round(result[0].duration)
            };
        });
    }

})