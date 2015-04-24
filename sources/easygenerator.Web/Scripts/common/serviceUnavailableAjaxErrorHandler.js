var app = app || {};

function serviceUnavailableAjaxErrorHandler() {
    var subscribeOnGlobalErrorEvents = function () {
        $(document).ajaxError(function (event, response) {
            if (!_.isNullOrUndefined(response)) {
                if (response.status == 503) {
                    app.reload();
                }
            }
        });
    };

    return {
        subscribeOnGlobalErrorEvents: subscribeOnGlobalErrorEvents
    };
};