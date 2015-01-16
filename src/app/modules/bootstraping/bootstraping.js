(function () {
    'use strict';

    angular.module('bootstraping', []).run(runBlock);

    runBlock.$inject = ['$q', 'detectDeviceTask', 'loadFontsTask', 'readSettingsTask'];

    function runBlock($q, detectDeviceTask, loadFontsTask, readSettingsTask) {

        var tasks = {
            'readSettings': readSettingsTask,
            'detectDeviceTask': detectDeviceTask,
            'loadFontsTask': loadFontsTask
        };

        $q.all(tasks).then(function (data) {
            angular.module('quiz').config(['$routeProvider', 'settingsProvider', function ($routeProvider, settingsProvider) {
                settingsProvider.setSettings(data.readSettings);
            }]);

            if (typeof data.readSettings !== null || data.readSettings.xApi.enabled) {
                angular.bootstrap(document, ['quiz', 'quiz.xApi']);
            } else {
                angular.bootstrap(document, ['quiz']);
            }

        });
    }

}());