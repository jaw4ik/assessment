define(['errorHandling/serviceUnavailabeErrorHandler'],
    function (internalServerErrorHandler) {
        var subscribe = function () {
            internalServerErrorHandler.subscribeOnGlobalErrorEvents();
        };

        return {
            subscribe: subscribe
        };
    });