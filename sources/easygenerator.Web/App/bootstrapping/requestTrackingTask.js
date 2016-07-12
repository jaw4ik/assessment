define(['http/httpRequestTracker'], function (tracker) {
    "use strict";

    var task = {
        execute: execute
    };

    return task;

    function execute() {
        tracker.startTracking();
    }

});