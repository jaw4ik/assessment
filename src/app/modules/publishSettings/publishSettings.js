(function () {
    'use strict';

    angular.module('assessment.publishSettings', []).run(runBlock);

    runBlock.$inject = ['publishSettings', 'publishModulesInitializer'];

    function runBlock(publishSettings, publishModulesInitializer) {
        if (publishSettings.modules && publishSettings.modules.length > 0) {
            publishModulesInitializer.init(publishSettings.modules);
        }
    }
}());