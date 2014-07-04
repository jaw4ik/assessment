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
            var removeTagsRegex = /<\s*p?|(div)?\s*>(\s|&nbsp;|<\/?\s?br\s?\/?>)*<\s*\/p?|(div)?\s*>|<\s*p?|(div)?\s*\/>|(\s|&nbsp;|<\/?\s?br\s?\/?>)*/g;
            var textWithoutTagsAndWhiteSpace = obj.replace(removeTagsRegex, '').trim();
            return _.isEmpty(textWithoutTagsAndWhiteSpace);
        }
    });

})();