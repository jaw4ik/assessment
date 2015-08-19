(function () {
    'use strict';

    angular.module('bootstrapping', []).run(runBlock);

    runBlock.$inject = ['$q', 'detectDeviceTask', 'loadFontsTask', 'readSettingsTask', 'readPublishSettingsTask', 'preloadImages', 'preloadHtmlTask', 'authenticationTask'];

    function runBlock($q, detectDeviceTask, loadFontsTask, readSettingsTask, readPublishSettingsTask, preloadImages, preloadHtmlTask, authenticationTask) {
        var tasks = {
            'detectDeviceTask': detectDeviceTask,
            'loadFontsTask': loadFontsTask,
            'readSettings': readSettingsTask,
            'readPublishSettings': readPublishSettingsTask,
            'authenticationTask': authenticationTask,
            'preloadHtmlTask': preloadHtmlTask,
            'preloadImages': preloadImages
        };

        $q.all(tasks).then(function (data) {
            var bootstrapModules = ['assessment'],
                settings = data.readSettings,
                publishSettings = data.readPublishSettings,
                user = data.authenticationTask,
                preloadHtmls = data.preloadHtmlTask;

            angular.module('assessment').config(['$routeProvider', 'settingsProvider', 'htmlTemplatesCacheProvider', 'userProvider', '$translateProvider', function ($routeProvider, settingsProvider, htmlTemplatesCacheProvider, userProvider, $translateProvider) {
                settingsProvider.setSettings(settings);
                userProvider.set(user);
                htmlTemplatesCacheProvider.set(preloadHtmls);

                configureTranslateProvider($translateProvider, settings);
            }]);

            if (!settings || _.isEmpty(settings) || (settings.xApi && settings.xApi.enabled)) {
                bootstrapModules.push('assessment.xApi');
            }

            if (publishSettings) {
                angular.module('assessment.publishSettings').config(['publishSettingsProvider', function (publishSettingsProvider) {
                    publishSettingsProvider.setSettings(publishSettings);
                }]);

                bootstrapModules.push('assessment.publishSettings');
            }

            if (publishSettings && publishSettings.modules) {
                var hasLms = _.some(publishSettings.modules, function (module) {
                    return module.name === 'lms';
                });

                if (!hasLms) {
                    bootstrapModules.push('assessment.progressStorer');
                }
            } else {
                bootstrapModules.push('assessment.progressStorer');
            }

            angular.bootstrap(document, bootstrapModules);
        });

        function configureTranslateProvider($translateProvider, settings) {
            var customLanguage = 'xx',
                defaultLanguage = 'en',
                customTranslations = {},
                selectedLanguage = defaultLanguage;

            if (settings && settings.languages) {
                if (settings.languages.customTranslations) {
                    customTranslations = settings.languages.customTranslations;
                }
                if (settings.languages.selected) {
                    selectedLanguage = settings.languages.selected;
                }
            }

            $translateProvider
                .useStaticFilesLoader({ prefix: 'lang/', suffix: '.json' })
                .translations(customLanguage, customTranslations)
                .fallbackLanguage(defaultLanguage)
                .preferredLanguage(selectedLanguage);
        }

    }
}());
