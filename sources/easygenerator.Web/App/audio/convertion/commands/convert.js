define(['Command', 'constants', 'audio/convertion/commands/getTicket', 'fileUpload'], function (Command, constants, getTicket, service) {

    return new Command(function (file) {
        return getTicket.execute().then(function (ticket) {
            return service.xhr2(constants.storage.audio.convertionUrl, file, { ticket: ticket }).then(function (result) {
                return {
                    url: result[0].url,
                    duration: Math.round(result[0].duration)
                };
            });
        });
    });

})