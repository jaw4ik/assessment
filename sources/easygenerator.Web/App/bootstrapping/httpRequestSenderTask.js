define(['http/httpRequestSender'], function (httpRequestSender) {
    "use strict";

    var task = {
        execute: execute
    };

    return task;

    function execute() {
        httpRequestSender.configure();
    }

});