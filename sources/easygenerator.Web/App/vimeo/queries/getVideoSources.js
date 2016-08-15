define(['jquery', 'constants'], function($, constants) {
    return {
        execute: execute
    }

    function execute(vimeoId) {
        var dfd = Q.defer();

        if (!_.isString(vimeoId)) {
            dfd.reject('vimeoId is not a string');
        }

        $.ajax({
            url: constants.player.host + constants.player.sourcesPath + '?mediaId=' + vimeoId,
            method: 'GET',
            global: false
        }).done(function(sources) {
            dfd.resolve(sources);
        }).fail(function () {
            dfd.resolve([]);
        });


        return dfd.promise;
    }
});