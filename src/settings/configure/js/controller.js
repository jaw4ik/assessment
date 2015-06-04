(function () {
    "use strict";

    angular.module('configure', [])
        .controller('ConfigureController', ['$scope', '$window', '$filter', ConfigureController]);

    function ConfigureController($scope, $window, $filter) {
        var that = $scope,
            currentSettings = null,
            api = window.egApi;

        that.isError = false;

        that.trackingData = (function () {
            var self = {};

            self.enableXAPI = true,
            self.allowToSkipTracking = false,
            self.lrsOptions = [
                {
                    key: 'default',
                    text: 'easygenerator (recommended)'
                },
                {
                    key: 'custom',
                    text: 'custom LRS'
                }
            ];
            self.selectedLrs = self.lrsOptions[0].key;

            self.lrsOptions.forEach(function (lrsOption) {
                lrsOption.isSelected = function () {
                    return self.selectedLrs === lrsOption.key;
                };

                lrsOption.select = function () {
                    self.lrsOptions.forEach(function (item) {
                        item.isSelected(false);
                    });
                    lrsOption.isSelected(true);
                    self.selectedLrs = lrsOption.key;
                };
            });

            self.customLrsEnabled = customLrsEnabled;

            self.lrsUrl = '';
            self.authenticationRequired = false;
            self.lapLogin = '';
            self.lapPassword = '';
            self.credentialsEnabled = credentialsEnabled;

            self.statements = {
                started: true,
                stopped: true,
                experienced: true,
                mastered: true,
                answered: true,
                passed: true,
                failed: true
            };

            self.advancedSettingsExpanded = false;
            self.toggleAdvancedSettings = toggleAdvancedSettings;

            self.init = init;

            return self;

            function customLrsEnabled() {
                return self.enableXAPI && self.selectedLrs !== self.lrsOptions[0].key;
            }

            function credentialsEnabled() {
                return self.customLrsEnabled() && self.authenticationRequired;
            }

            function toggleAdvancedSettings() {
                self.advancedSettingsExpanded = !self.advancedSettingsExpanded;
            }

            function init(xApiSettings) {
                self.enableXAPI = xApiSettings.enabled || false;
                self.allowToSkipTracking = !xApiSettings.required;
                var defaultLrs = xApiSettings.enabled ? 'custom' : 'default';
                self.selectedLrs = xApiSettings.selectedLrs || defaultLrs;
                self.lrsUrl = xApiSettings.lrs.uri || '';
                self.authenticationRequired = xApiSettings.lrs.authenticationRequired || false;
                self.lapLogin = xApiSettings.lrs.credentials.username || '';
                self.lapPassword = xApiSettings.lrs.credentials.password || '';

                var key;
                if (xApiSettings.allowedVerbs) {
                    for (key in self.statements) {
                        if (self.statements.hasOwnProperty(key)) {
                            self.statements[key] = xApiSettings.allowedVerbs.indexOf(key) > -1;
                        }
                    }
                }
            }
        })();

        that.masteryScore = (function () {
            var self = {};

            self.value = 0;
            self.init = init;

            return self;

            function init(masteryScoreSettings) {
                if (masteryScoreSettings && masteryScoreSettings.score >= 0 && masteryScoreSettings.score <= 100) {
                    self.value = masteryScoreSettings.score;
                } else {
                    self.value = 100;
                }
            }
        })();

        that.languages = (function () {
            var self = {},
                defaultLanguageCode = 'en',
                customLanguageCode = 'xx';

            self.languagesList = [];

            self.selectedLanguageCode = '';
            self.selectedLanguage = null;

            self.getCustomTranslations = getCustomTranslations;
            self.init = init;

            that.$watch('languages.selectedLanguageCode', function () {
                var language = _getLanguage(self.selectedLanguageCode);

                if (!language) {
                    return;
                }

                language.load().then(function () {
                    self.selectedLanguage = language;
                    that.$applyAsync();
                });
            });

            return self;

            function getCustomTranslations() {
                var customLanguage = _getLanguage(customLanguageCode);
                return customLanguage ? customLanguage.resources : {};
            }

            function init(languages, languagesSettings) {
                languages.forEach(function (language) {
                    self.languagesList.push(new Language(language.code, language.name, language.url, false));
                });

                var defaultLanguage = _getLanguage(defaultLanguageCode);
                var customLanguage = new Language(customLanguageCode, 'Custom', defaultLanguage ? defaultLanguage.resourcesUrl : null, true, languagesSettings ? languagesSettings.customTranslations : null);

                self.languagesList.push(customLanguage);

                self.selectedLanguageCode = (languagesSettings && languagesSettings.selected) ? languagesSettings.selected : defaultLanguageCode;
            }

            function _getLanguage(code) {
                return $filter('filter')(self.languagesList, { code: code })[0];
            }

            function Language(code, name, resourcesUrl, isEditable, userTranslations) {
                var _isLoaded = false;

                var that = this;

                that.code = code;
                that.name = name;
                that.isEditable = isEditable;
                that.resourcesUrl = resourcesUrl;
                that.resources = userTranslations || {};

                that.load = load;

                function load() {
                    if (_isLoaded) {
                        return $.when();
                    }

                    return loadLanguageResources(that.resourcesUrl).then(function (resources) {
                        that.resources = $.isEmptyObject(that.resources) ? resources : extend(that.resources, resources);
                        _isLoaded = true;
                    });
                }

                function extend(source, defaults) {
                    var extendedList = {};
                    $.each(defaults, function (key, value) {
                        extendedList[key] = typeof source[key] == "string" ? source[key] : value;
                    });
                    return extendedList;
                }

                function loadLanguageResources(url) {
                    return $.ajax({
                        url: url,
                        dataType: 'json',
                        contentType: 'application/json'
                    });
                }
            }

        })();

        that.timer = (function () {
            var self = {};

            self.enabled = false;
            self.hours = 0;
            self.minutes = 30;
            self.seconds = 0;

            self.init = init;

            return self;

            function init(timerSettings) {
                if (!timerSettings || !timerSettings.time) {
                    return;
                }

                self.enabled = timerSettings.enabled;

                self.hours = timerSettings.time.hours;
                self.minutes = timerSettings.time.minutes;
                self.seconds = timerSettings.time.seconds;
            }
        })();
        
        that.questionsPool = (function () {
            var self = {};

            self.modes = {
                all: 'all',
                subset: 'subset'
            };
            self.mode = self.modes.all;
            
            self.subsetSize = 10;
            self.randomizeOrder = true;
            self.randomizePerAttempt = false;
            
            self.init = init;

            return self;

            function init(questionsPoolSettings) {
                if (!questionsPoolSettings) {
                    return;
                }

                self.mode = questionsPoolSettings.mode;
                self.subsetSize = questionsPoolSettings.subsetSize;
                self.randomizeOrder = questionsPoolSettings.randomizeOrder;
                self.randomizePerAttempt = questionsPoolSettings.randomizePerAttempt;
            }
        })();

        angular.element($window).on('blur', saveChanges);

        function saveChanges() {
            var newSettings = getCurrentSettings();

            if (angular.equals(currentSettings, newSettings)) {
                return;
            }

            api.saveSettings(JSON.stringify(newSettings), null).done(function () {
                currentSettings = newSettings;
            });
        };

        function getCurrentSettings(settings) {
            return $.extend({}, settings || currentSettings, {
                xApi: {
                    enabled: that.trackingData.enableXAPI,
                    required: !that.trackingData.allowToSkipTracking,
                    selectedLrs: that.trackingData.selectedLrs,
                    lrs: {
                        uri: that.trackingData.lrsUrl,
                        authenticationRequired: that.trackingData.authenticationRequired,
                        credentials: {
                            username: that.trackingData.lapLogin,
                            password: that.trackingData.lapPassword
                        }
                    },
                    allowedVerbs: $.map(that.trackingData.statements, function (value, key) {
                        return value ? key : undefined;
                    })
                },
                masteryScore: {
                    score: that.masteryScore.value || 0
                },
                languages: {
                    selected: that.languages.selectedLanguageCode,
                    customTranslations: that.languages.getCustomTranslations()
                },
                timer: {
                    enabled: that.timer.enabled,
                    time: {
                        hours: that.timer.hours,
                        minutes: that.timer.minutes,
                        seconds: that.timer.seconds
                    }
                },
                questionsPool: {
                    mode: that.questionsPool.mode,
                    subsetSize: that.questionsPool.subsetSize,
                    randomizeOrder: that.questionsPool.randomizeOrder,
                    randomizePerAttempt: that.questionsPool.randomizePerAttempt
                }
            });
        }

        //#region Initialization

        return api.init().then(function () {
            var manifest = api.getManifest(),
                settings = api.getSettings();

            that.trackingData.init(settings.xApi);
            that.masteryScore.init(settings.masteryScore);
            that.languages.init(manifest.languages, settings.languages);
            that.timer.init(settings.timer);
            that.questionsPool.init(settings.questionsPool);

            currentSettings = getCurrentSettings(settings);

        }).fail(function () {
            that.isError = true;
        }).always(function () {
            that.$applyAsync();
        });

        //#endregion Initialization
    }

})();