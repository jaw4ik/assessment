define(['errorHandling/httpErrorHandlerRegistrator', 'errorHandling/httpErrorHandlers/defaultHttpErrorHandler'],
    function (errorHandlerRegistrator, defaultHttpErrorHandler) {
        "use strict";

        var subscribeOnAjaxErrorEvents = function () {
            $(document).ajaxError(function (event, response) {
                if (!_.isNullOrUndefined(response) && !_.isNullOrUndefined(response.status)) {
                    var handler = errorHandlerRegistrator.registeredHandlers[response.status];
                    if (!_.isNullOrUndefined(handler)) {
                        handler.handleError(response);
                        return;
                    }
                }

                defaultHttpErrorHandler.handleError(response);
            });
        };

        return {
            subscribeOnAjaxErrorEvents: subscribeOnAjaxErrorEvents
        };
    });