define(['context'], function (context) {

    return {
        initialize: initialize
    };

    function initialize(settings) {
        return Q.fcall(function () {
            if (!_.isEmptyOrWhitespace(settings.url)) {
                context.logoUrl = settings.url;
            }
        });
    }

})