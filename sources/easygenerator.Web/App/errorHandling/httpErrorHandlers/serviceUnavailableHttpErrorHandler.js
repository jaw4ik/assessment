define(['plugins/router'], function (router) {
    "use strict";

    var handleError = function () {
        router.reset();
        router.reloadLocation();
    };

    return {
        handleError: handleError
    };
});