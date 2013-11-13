define(['plugins/router'], function (router) {
    var handleError = function () {
        router.setLocation('/signin');
    };

    return {
        handleError: handleError
    };
});