define(['localization/localizationManager', 'notify'], function (localizationManager, notify) {

    return {
        handleError: handleError
    };

    function handleError(error) {
        notify.error(localizationManager.localize(error.statusText));
    };

});