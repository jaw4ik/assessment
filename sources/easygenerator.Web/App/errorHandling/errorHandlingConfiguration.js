define(['errorHandling/httpErrorHandlerRegistrator',
    'errorHandling/httpErrorHandlers/serviceUnavailableHttpErrorHandler',
    'errorHandling/httpErrorHandlers/forbiddenHttpErrorHandler',
    'errorHandling/httpErrorHandlers/unauthorizedHttpErrorHandler'],
    function (httpErrorHandlerRegistrator, serviceUnavailableHttpErrorHandler, forbiddenHttpErrorHandler, unauthorizedHttpErrorHandler) {
        "use strict";

        var configure = function () {
            httpErrorHandlerRegistrator.registerHandler(401, unauthorizedHttpErrorHandler);
            httpErrorHandlerRegistrator.registerHandler(403, forbiddenHttpErrorHandler);
            httpErrorHandlerRegistrator.registerHandler(503, serviceUnavailableHttpErrorHandler);
        };

        return {
            configure: configure
        };
    });