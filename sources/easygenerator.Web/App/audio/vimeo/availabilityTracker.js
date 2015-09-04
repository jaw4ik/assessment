define(['audio/queries/getNotAvailable', 'vimeo/queries/checkAvailability', 'audio/finishUpload'], function (getNotAvailable, checkAvailability, finishUpload) {

    return {
        track: track
    };

    function track() {

        return getNotAvailable.execute().then(function (audios) {            
            return Q.allSettled(audios.map(function (audio) {
                return checkAvailability.execute(audio).then(function (result) {
                    if (result) {
                        return finishUpload.execute(audio);
                    }
                });
            }));
        });
    }

});