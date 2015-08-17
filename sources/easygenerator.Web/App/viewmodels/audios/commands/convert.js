define(['constants', 'fileUpload'], function (constants, service) {

    return {
        execute: execute
    };

    function execute(file) {
        return service.xhr2(file, constants.storage.audio.conversionUrl).then(function (result) {
            return {
                url: result[0].url,
                duration: Math.round(result[0].duration)
            };
        });
    }

})