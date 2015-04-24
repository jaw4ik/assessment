define(['routing/routerExtender'], function (extender) {
    "use strict";

    var task = {
        execute: execute
    };

    return task;

    function execute() {
        extender.execute();
    }

});