define(['plugins/router'], function (router) {
    var handleError = function () {
        router.reloadLocation();
    };

    return {
        handleError: handleError
    };
});