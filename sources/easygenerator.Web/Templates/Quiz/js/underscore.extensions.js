(function () {
    "use strict";
    if (typeof (_) !== "function") {
        throw new Error("underscore not found.");
    }

    _.isEmptyOrWhitespace = function (obj) {
        if (!_.isString(obj))
            throw new TypeError;

        return _.isEmpty(obj.trim());
    };

    _.isNullOrUndefined = function (obj) {
        return _.isUndefined(obj) || _.isNull(obj);
    };

    var htmlText = $('<div/>');

    _.isEmptyHtmlText = function(obj) {
        return _.isEmpty(htmlText.html(obj).text().trim());
    };

})();