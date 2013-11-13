define(['errorHandling/httpErrorHandlerRegistrator', 'errorHandling/httpErrorHandlers/serviceUnavailableHttpErrorHandler', 'errorHandling/httpErrorHandlers/unauthorizedHttpErrorHandler'],
    function (httpErrorHandlerRegistrator, serviceUnavailableHttpErrorHandler, unauthorizedHttpErrorHandler) {

        var configure = function () {
            httpErrorHandlerRegistrator.registerHandler(401, unauthorizedHttpErrorHandler);
            httpErrorHandlerRegistrator.registerHandler(503, serviceUnavailableHttpErrorHandler);
        };

        return {
            configure: configure
        };
    });