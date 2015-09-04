define(['Command', 'plugins/http', 'audio/convertion/commands/getTicket'], function (Command, http, getTicket) {

    return new Command(function (audio) {
        return getTicket.execute().then(function (ticket) {
            var dfd = Q.defer();
            
            http.remove(audio.source, null, { ticket: ticket }).done(function () {
                dfd.resolve();
            }).fail(function () {
                dfd.reject();
            });

            return dfd.promise;
        });
    });

})