window.utils = window.utils || {};
(function (utils) {
    utils.createString = function (length) {
        return new Array(length + 1).join("*");
    };
})(window.utils);

