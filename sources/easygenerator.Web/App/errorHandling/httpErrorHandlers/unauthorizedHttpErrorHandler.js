define(['routing/router'], function (router) {
    "use strict";

    var handleError = function () {
        router.setLocation('/signin');
    };

    return {
        handleError: handleError
    };
});