define(['plugins/router'], function (router) {
    var subscribeOnGlobalErrorEvents = function () {
        $(document).ajaxError(function (event, response) {

            if (!_.isNullOrUndefined(response)) {
                if (response.status == 503) {
                    router.reloadLocation();
                }
            }
        });
    };

    return {
        subscribeOnGlobalErrorEvents: subscribeOnGlobalErrorEvents
    };
});