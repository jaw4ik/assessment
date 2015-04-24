define(['localization/localizationManager', 'notify'], function (localizationManager, notify) {
    "use strict";

    var handleError = function (response) {
        if (!_.isNullOrUndefined(response) && _.isString(response)) {
            notify.error(response);
        } else {
            notify.error(localizationManager.localize("responseFailed"));
        }
    };

    return {
        handleError: handleError
    };
});