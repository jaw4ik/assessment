(function () {
    'use strict';

    angular.module('bootstraping', []).run(runBlock);

    runBlock.$inject = ['$q', 'detectDeviceTask', 'loadFontsTask'];

    function runBlock($q, detectDeviceTask, loadFontsTask) {

        var tasks = {
            'detectDeviceTask': detectDeviceTask,
            'loadFontsTask': loadFontsTask
        };

        $q.all(tasks).then(function () {
            angular.bootstrap(document, ['quiz']);
        });
    }

}());