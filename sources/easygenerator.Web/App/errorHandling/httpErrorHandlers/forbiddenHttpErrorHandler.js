define(['localization/localizationManager', 'notify'], function (localizationManager, notify) {
    "use strict";

    return {
        handleError: handleError
    };

    function handleError(response) {
        var responseKey = response.getResponseHeader('ErrorMessageResourceKey');
        notify.error(localizationManager.localize(responseKey));
    };

});