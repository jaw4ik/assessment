define([], function () {
    "use strict";

    return {
        throwIfNotAnObject: function (obj, message) {
            if (!_.isObject(obj)) {
                throw message;
            }
        },

        throwIfNotString: function (str, message) {
            if (!_.isString(str)) {
                throw message;
            }
        },

        throwIfNotBoolean: function (bool, message) {
            if (!_.isBoolean(bool)) {
                throw message;
            }
        },

        throwIfNotArray: function (array, message) {
            if (!_.isArray(array)) {
                throw message;
            }
        },

        throwIfNotDate: function (date, message) {
            if (!_.isDate(date) || _.isNaN(date.getTime())) {
                throw message;
            }
        },

        throwIfNotNumber: function (number, message) {
            if (!_.isNumber(number)) {
                throw message;
            }
        },

        throwIfNotPositiveNumber: function (number, message) {
            if (!_.isNumber(number) || number < 0) {
                throw message;
            }
        },

        throwIfNotFunction: function (func, message) {
            if (!_.isFunction(func)) {
                throw message;
            }
        }
    };

});