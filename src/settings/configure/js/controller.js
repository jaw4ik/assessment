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
            self.getData = getData;

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

            function getData() {
                return {
                    enabled: self.enableXAPI,
                    required: !self.allowToSkipTracking,
                    selectedLrs: self.selectedLrs,
                    lrs: {
                        uri: self.lrsUrl,
                        authenticationRequired: self.authenticationRequired,
                        credentials: {
                            username: self.lapLogin,
                            password: self.lapPassword
                        }
                    },
                    allowedVerbs: $.map(self.statements, function (value, key) {
                        return value ? key : undefined;
                    })
                };
            }
        })();

        that.masteryScore = (function () {
            var self = {};

            self.value = 0;

            self.init = init;
            self.getData = getData;

            return self;

            function init(masteryScoreSettings) {
                if (masteryScoreSettings && masteryScoreSettings.score >= 0 && masteryScoreSettings.score <= 100) {
                    self.value = masteryScoreSettings.score;
                } else {
                    self.value = 100;
                }
            }

            function getData() {
                return {
                    score: self.value || 0
                };
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
            self.getData = getData;

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

                orderLanguages();

                var defaultLanguage = _getLanguage(defaultLanguageCode);
                var customLanguage = new Language(customLanguageCode, 'Custom', defaultLanguage ? defaultLanguage.resourcesUrl : null, true, languagesSettings ? languagesSettings.customTranslations : null);

                self.languagesList.push(customLanguage);

                self.selectedLanguageCode = (languagesSettings && languagesSettings.selected) ? languagesSettings.selected : defaultLanguageCode;
            }

            function orderLanguages() {
                self.languagesList.sort(function (a, b) {
                    return a.name.localeCompare(b.name);
                });
            }

            function getData() {
                return {
                    selected: self.selectedLanguageCode,
                    customTranslations: self.getCustomTranslations()
                };
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
            self.getData = getData;

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

            function getData() {
                return {
                    enabled: self.enabled,
                    time: {
                        hours: self.hours,
                        minutes: self.minutes,
                        seconds: self.seconds
                    }
                };
            }
        })();

        that.questionPool = (function () {
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
            self.getData = getData;

            return self;

            function init(questionPoolSettings) {
                if (!questionPoolSettings) {
                    return;
                }

                self.mode = questionPoolSettings.mode;
                self.subsetSize = questionPoolSettings.subsetSize;
                self.randomizeOrder = questionPoolSettings.randomizeOrder;
                self.randomizePerAttempt = questionPoolSettings.randomizePerAttempt;
            }

            function getData() {
                var resultData = {};

                resultData.mode = self.mode;
                resultData.subsetSize = self.subsetSize;
                
                if (self.mode === self.modes.all) {
                    resultData.randomizeOrder = self.randomizeOrder;
                    resultData.randomizePerAttempt = self.randomizeOrder && self.randomizePerAttempt;
                } else if (self.mode === self.modes.subset) {
                    resultData.randomizeOrder = true;
                    resultData.randomizePerAttempt = self.randomizePerAttempt;
                }

                return resultData;
            }
        })();

        that.answers = (function () {
            var self = {
                randomize: false,
                init: init,
                getData: getData
            };

            return self;

            function init(answersSettings) {
                if (!answersSettings)
                    return;

                self.randomize = answersSettings.randomize;
            }

            function getData() {
                return {
                    randomize: self.randomize
                };
            }
        })();

        that.attempt = (function () {
            var self = {
                hasLimit: false,
                limit: 3,
                init: init,
                getData: getData
            };

            return self;

            function init(attemptsSettings) {
                if (!attemptsSettings)
                    return;

                self.hasLimit = attemptsSettings.hasLimit;
                self.limit = attemptsSettings.limit;
            }

            function getData() {
                return {
                    hasLimit: self.hasLimit,
                    limit: self.limit
                };
            }
        })();

        that.assessmentMode = (function () {
            var self = {
                init: init,
                getData: getData
            };
            self.modes = {
                quiz: 'quiz',
                exam: 'exam'
            };
            self.mode = self.modes.quiz;
            self.attemptsSettings = {
                quiz: {
                    hasLimit: true,
                    limit: 3,
                },
                exam: {
                    hasLimit: true,
                    limit: 1,
                }
            };

            return self;

            function init(assessmentMode) {
                if (!assessmentMode) {
                    return;
                }

                self.mode = assessmentMode;
            }

            function getData() {
                return self.mode;
            }
        })();

        $scope.$watch('assessmentMode.mode', function (mode, prevMode) {
            that.assessmentMode.attemptsSettings[prevMode] = that.attempt.getData();
            that.attempt.init(that.assessmentMode.attemptsSettings[mode]);
        });

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
                xApi: that.trackingData.getData(),
                masteryScore: that.masteryScore.getData(),
                languages: that.languages.getData(),
                timer: that.timer.getData(),
                questionPool: that.questionPool.getData(),
                attempt: that.attempt.getData(),
                assessmentMode: that.assessmentMode.getData(),
                answers: that.answers.getData()
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
            that.questionPool.init(settings.questionPool);
            that.answers.init(settings.answers);
            that.attempt.init(settings.attempt);
            that.assessmentMode.init(settings.assessmentMode);

            currentSettings = getCurrentSettings(settings);

        }).fail(function () {
            that.isError = true;
        }).always(function () {
            that.$applyAsync();
            api.showSettings();
        });

        //#endregion Initialization
    }

})();