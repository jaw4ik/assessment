define(['durandal/system', 'audio/queries/getNotAvailable', 'vimeo/queries/checkAvailability', 'audio/finishUpload'], function (system, getNotAvailable, checkAvailability, finishUpload) {

    return {
        track: track
    };

    function track() {

        return getNotAvailable.execute().then(function (audios) {
            return Q.allSettled(audios.map(function (audio) {
                system.log('Checking audio ' + audio.id);
                return checkAvailability.execute(audio).then(function (result) {
                    if (result) {
                        return finishUpload.execute(audio);
                    }
                });
            }));
        });
    }

});