define(['plugins/http', 'constants'], function (http, constants) {
    return {
        execute: execute
    }

    function execute(vimeoId) {
        var dfd = Q.defer();

        if (!_.isString(vimeoId)) {
            dfd.reject('vimeoId is not a string');
        }

        http.get(constants.storage.video.vimeoApiVideosUrl + vimeoId, null, { Authorization: constants.storage.video.vimeoToken })
            .done(function (result) {
                dfd.resolve(result);
            })
            .fail(function () {
                dfd.reject();
            });


        return dfd.promise;
    }
});