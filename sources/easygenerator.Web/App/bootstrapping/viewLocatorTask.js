define(['durandal/viewLocator'], function(viewLocator) {
    "use strict";

    var task = {
        execute: execute
    };

    return task;

    function execute() {
        viewLocator.useConvention();
    }

});