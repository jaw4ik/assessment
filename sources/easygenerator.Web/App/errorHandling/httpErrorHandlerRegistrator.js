define([], function () {
    "use strict";

    var registeredHandlers = {};

    var registerHandler = function (status, handler) {
        if (!_.isNullOrUndefined(this.registeredHandlers[status])) {
            throw 'Error handler for status code ' + status + ' has already been registered.';
        }

        if (!_.isFunction(handler.handleError)) {
            throw 'Error handler has to expose \'handleError()\' method';
        }

        this.registeredHandlers[status] = handler;
    };

    return {
        registerHandler: registerHandler,
        registeredHandlers: registeredHandlers
    };
});