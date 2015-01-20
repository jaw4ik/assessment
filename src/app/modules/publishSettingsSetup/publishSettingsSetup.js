(function () {
    'use strict';

    angular.module('quiz.publishSettingsSetup', []).run(runBlock);

    runBlock.$inject = ['publishSettings', 'publishModulesInitializer'];

    function runBlock(publishSettings, publishModulesInitializer) {
        if (publishSettings.modules && publishSettings.modules.length > 0) {
            publishModulesInitializer.initModules(publishSettings.modules);
        }
    };
}());