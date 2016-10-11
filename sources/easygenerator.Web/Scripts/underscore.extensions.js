(function () {
    "use strict";
    if (typeof (_) !== "function") {
        throw new Error("underscore not found.");
    }

    _.mixin({
        isEmptyOrWhitespace: function (obj) {
            if (!_.isString(obj))
                throw new TypeError;

            return _.isEmpty(obj.trim());
        },
        isNullOrUndefined: function (obj) {
            return _.isUndefined(obj) || _.isNull(obj);
        },
        isEmptyHtmlText: function (obj) {
            if (_.isNullOrUndefined(obj)) {
                return true;
            }

            return _.isEmpty(obj
                .replace(/<\/?span[^>]*>/g, '')
                .replace(/<\/?div[^>]*>/g, '')
                .replace(/<\/?p[^>]*>/g, '')
                .replace(/<\/?br[^>]*>/g, '')

                .replace(/\n/g, '')

                .replace(/[\u200B-\u200D\uFEFF]/g, '')
                .replace(/&nbsp;/g, '')
                .trim());
        },
        isDefined: function (obj) {
            return !_.isUndefined(obj);
        },
        isCompleteMatch: function (x, y) {
            if (x === null || x === undefined || y === null || y === undefined) {
                return x === y;
            }
            // after this just checking type of one would be enough
            if (x.constructor !== y.constructor) {
                return false;
            }
            // if they are functions, they should exactly refer to same one (because of closures)
            if (x instanceof Function) {
                return x === y;
            }
            // if they are regexps, they should exactly refer to same one (it is hard to better equality check on current ES)
            if (x instanceof RegExp) {
                return x === y;
            }
            if (x === y || x.valueOf() === y.valueOf()) {
                return true;
            }
            if (Array.isArray(x) && x.length !== y.length) {
                return false;
            }

            // if they are dates, they must had equal valueOf
            if (x instanceof Date) {
                return false;
            }

            // if they are strictly equal, they both need to be object at least
            if (!(x instanceof Object)) {
                return false;
            }
            if (!(y instanceof Object)) {
                return false;
            }

            // recursive object equality check
            return Object.keys(x).every(function (i) {
                return _.isCompleteMatch(x[i], y[i]);
            });
        }
    });

})();