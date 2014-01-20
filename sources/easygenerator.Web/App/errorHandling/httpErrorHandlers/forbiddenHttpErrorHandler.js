define(['localization/localizationManager', 'notify'], function (localizationManager, notify) {

    return {
        handleError: handleError
    };

    function handleError(response) {
        notify.error(localizationManager.localize(response.getResponseHeader('ErrorMessageResourceKey')));
    };

});