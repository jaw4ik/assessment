define(['errorHandling/httpErrorHandlerRegistrator', 'errorHandling/httpErrorHandlers/defaultHttpErrorHandler', 'constants'],
    function (errorHandlerRegistrator, defaultHttpErrorHandler, constants) {
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
                /* Vimeo return 308 as a success result status */
                if (response && response.status == constants.messages.storage.video.vimeoVerifyStatus) {
                    return;
                }

                defaultHttpErrorHandler.handleError(response);
            });
        };

        return {
            subscribeOnAjaxErrorEvents: subscribeOnAjaxErrorEvents
        };
    });