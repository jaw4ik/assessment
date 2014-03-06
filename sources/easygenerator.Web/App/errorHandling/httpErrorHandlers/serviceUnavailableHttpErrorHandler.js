define(['plugins/router'], function (router) {
    "use strict";

    var handleError = function () {
        router.reloadLocation();
    };

    return {
        handleError: handleError
    };
});