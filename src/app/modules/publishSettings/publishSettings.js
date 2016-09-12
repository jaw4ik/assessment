(function () {
    'use strict';

    angular.module('assessment.publishSettings', []).run(runBlock);

    runBlock.$inject = ['publishModules', 'publishModulesInitializer'];

    function runBlock(publishModules, publishModulesInitializer) {
        if (publishModules && publishModules.length > 0) {
            publishModulesInitializer.init(publishModules);
        }
    }
}());