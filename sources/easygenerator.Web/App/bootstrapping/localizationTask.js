define(['localization/localizationManager'], function (localizationManager) {

    return {
        execute: function () {
            localizationManager.initialize(window.top.userCultures);
        }
    };

})