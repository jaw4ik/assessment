define(function () {
    "use strict";

    var
        set = function (key, value) {

            if (_.isNullOrUndefined(key) ||
                _.isEmpty(key) ||
                _.isUndefined(value)) {
                throw 'Invalid arguments';
            }

            localStorage.setItem(key, JSON.stringify(value));
            return value;
        },

        get = function (key) {

            if (_.isNullOrUndefined(key) ||
                _.isEmpty(key)) {
                throw 'Invalid arguments';
            }

            return JSON.parse(localStorage.getItem(key));
        },

        remove = function (key) {
            if (_.isNullOrUndefined(key) || _.isEmpty(key)) {
                throw 'Invalid arguments';
            }

            localStorage.removeItem(key);
        };

    return {
        set: set,
        get: get,
        remove: remove
    };
});