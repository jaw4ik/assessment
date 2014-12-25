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
            angular.module('quiz').config(['settingsProvider', function (settingsProvider) {
                settingsProvider.setSettings(data.readSettings);
            }]);

            angular.bootstrap(document, ['quiz']);
        });
    }

}());