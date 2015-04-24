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
        }
    });

})();