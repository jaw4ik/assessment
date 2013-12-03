define(['errorHandling/errorHandlingConfiguration', 'errorHandling/globalErrorHandler'], function (errorHandlingConfiguration, globalErrorHandler) {

    return {
        execute: function () {
            errorHandlingConfiguration.configure();
            globalErrorHandler.subscribeOnAjaxErrorEvents();
        }
    };

})