define(['errorHandling/httpErrorHandlerRegistrator', 'errorHandling/httpErrorHandlers/serviceUnavailableHttpErrorHandler'],
    function (httpErrorHandlerRegistrator, serviceUnavailableHttpErrorHandler) {

        var configure = function () {
            httpErrorHandlerRegistrator.registerHandler(503, serviceUnavailableHttpErrorHandler);
        };

        return {
            configure: configure
        };
    });