(function () {
    'use strict';

    angular.module('quiz')
           .provider('settings', settingsProvider);

    function settingsProvider() {
        var cachedSettings = {},
            defaultSettings = {
                logo: {
                    url: 'css/img/eg-logo.png'
                },
                xApi: {
                    enabled: true,
                    selectedLrs: 'default'
                },
                masteryScore: {
                    score: 100
                },
                languages: {
                    selected: 'en'
                },
                background: {
                    image: {
                        src: 'css/img/main-background.jpg',
                        type: 'fullscreen'
                    }
                },
                timer: {
                    enabled: false,
                    time: {
                        hours: 0,
                        minutes: 30,
                        seconds: 0
                    }
                },
                questionPool: {
                    mode: 'all',
                    subsetSize: 10,
                    randomizeOrder: true,
                    randomizePerAttempt: false
                }
            };


        return {
            setSettings: function (settings) {
                if (!_.isObject(settings)) {
                    cachedSettings = defaultSettings;
                    return;
                }

                if (!_.isObject(settings.logo) || _.isUndefined(settings.logo.url) || _.isEmpty(settings.logo.url)) {
                    _.extend(settings, { logo: defaultSettings.logo });
                }

                if (!_.isObject(settings.xApi) || _.isUndefined(settings.xApi.enabled)) {
                    _.extend(settings, { xApi: defaultSettings.xApi });
                }

                if (!_.isObject(settings.masteryScore) || _.isUndefined(settings.masteryScore.score)) {
                    _.extend(settings, { masteryScore: defaultSettings.masteryScore });
                }

                if (!_.isObject(settings.languages) || _.isUndefined(settings.languages.selected) || _.isEmpty(settings.languages.selected)) {
                    _.extend(settings, { languages: defaultSettings.languages });
                }

                if (!_.isObject(settings.background) || _.isUndefined(settings.background.image) ||
                    _.isUndefined(settings.background.image.src) || _.isNull(settings.background.image.src) || _.isEmpty(settings.background.image.src)) {
                    _.extend(settings, { background: defaultSettings.background });
                }

                if (!_.isObject(settings.timer) || _.isUndefined(settings.timer.enabled)) {
                    _.extend(settings, { timer: defaultSettings.timer });
                }
                
                if (!_.isObject(settings.questionPool) || _.isUndefined(settings.questionPool.mode)) {
                    _.extend(settings, { questionPool: defaultSettings.questionPool });
                }

                cachedSettings = settings;
            },
            $get: function () {
                return cachedSettings;
            }
        };
    }
}());