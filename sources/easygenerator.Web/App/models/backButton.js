define(function () {
    "use strict";

    var BackButton = function (params) {

        this.url = params.url;
        this.backViewName = params.backViewName;
        this.callback = params.callback;
        this.alwaysVisible = params.alwaysVisible;
    };

    BackButton.prototype.configure = function (params) {
        if (!_.isObject(params)) {
            return;
        }

        if (!_.isNullOrUndefined(params.url)) {
            this.url = params.url;
        }
        if (!_.isNullOrUndefined(params.backViewName)) {
            this.backViewName = params.backViewName;
        }
        if (!_.isNullOrUndefined(params.callback)) {
            this.callback = params.callback;
        }
        if (!_.isNullOrUndefined(params.alwaysVisible)) {
            this.alwaysVisible = params.alwaysVisible;
        }
    };

    return BackButton;

});