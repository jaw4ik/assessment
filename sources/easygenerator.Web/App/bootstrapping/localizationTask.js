define(['localization/localizationManager'], function(localizationManager) {
    "use strict";

    var task = {
        execute: execute
    };

    return task;

    function execute() {        
        localizationManager.initialize(window.top.userCultures);
    }

});