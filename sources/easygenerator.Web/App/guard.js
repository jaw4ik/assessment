import _ from 'underscore';
import ko from 'knockout';

export default class {
    static throwIfNotDefined(prop, message) {
        if (_.isUndefined(prop)) {
            throw message;
        }
    }

    static throwIfNotAnObject(obj, message) {
        if (!_.isObject(obj)) {
            throw message;
        }
    }

    static throwIfNotString(str, message) {
        if (!_.isString(str)) {
            throw message;
        }
    }

    static throwIfNotBoolean(bool, message) {
        if (!_.isBoolean(bool)) {
            throw message;
        }
    }

    static throwIfNotArray(array, message) {
        if (!_.isArray(array)) {
            throw message;
        }
    }

    static throwIfNotDate(date, message) {
        if (!_.isDate(date) || _.isNaN(date.getTime())) {
            throw message;
        }
    }

    static throwIfNotNumber(number, message) {
        if (!_.isNumber(number)) {
            throw message;
        }
    }

    static throwIfNotPositiveNumber(number, message) {
        if (!_.isNumber(number) || number < 0) {
            throw message;
        }
    }

    static throwIfNotFunction(func, message) {
        if (!_.isFunction(func)) {
            throw message;
        }
    }

    static throwIfNotObservable(observable, message) {
        if (!ko.isObservable(observable)) {
            throw message;
        }
    }

    static throwIfNotObservableArray(observableArray, message) {
        if (!ko.isObservable(observableArray) || !_.isArray(ko.unwrap(observableArray))) {
            throw message;
        }
    }
}