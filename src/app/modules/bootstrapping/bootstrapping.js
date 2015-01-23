(function () {
    'use strict';

    angular.module('bootstrapping', []).run(runBlock);

    runBlock.$inject = ['$q', 'detectDeviceTask', 'loadFontsTask', 'readSettingsTask', 'readPublishSettingsTask', 'preloadImages'];

    function runBlock($q, detectDeviceTask, loadFontsTask, readSettingsTask, readPublishSettingsTask, preloadImages) {
        var tasks = {
            'detectDeviceTask': detectDeviceTask,
            'loadFontsTask': loadFontsTask,
            'readSettings': readSettingsTask,
            'readPublishSettings': readPublishSettingsTask,
            'preloadImages': preloadImages
        };

        $q.all(tasks).then(function (data) {
            var bootstrapModules = ['quiz'],
                settings = data.readSettings,
                publishSettings = data.readPublishSettings;

            angular.module('quiz').config(['$routeProvider', 'settingsProvider', function ($routeProvider, settingsProvider) {
                settingsProvider.setSettings(settings);
            }]);

            if (!settings || settings.xApi.enabled) {
                bootstrapModules.push('quiz.xApi');
            }

            if (publishSettings) {
                angular.module('quiz.publishSettings').config(['publishSettingsProvider', function (publishSettingsProvider) {
                    publishSettingsProvider.setSettings(publishSettings);
                }
                ]);

                bootstrapModules.push('quiz.publishSettings');
            }

            angular.bootstrap(document, bootstrapModules);
        });

    }
}());
