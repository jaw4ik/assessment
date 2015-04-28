define(['errorHandling/errorHandlingConfiguration', 'errorHandling/globalErrorHandler'], function(errorHandlingConfiguration, globalErrorHandler) {
    "use strict";

    var task = {
        execute: execute
    };

    return task;

    function execute() {
        errorHandlingConfiguration.configure();
        globalErrorHandler.subscribeOnAjaxErrorEvents();
    }

});