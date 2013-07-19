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
})();