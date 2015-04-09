(function () {
    "use strict";

    angular.module('settings', [])
        .controller('SettingsController', ['$scope', '$window', '$q', '$filter', SettingsController]);

    function SettingsController($scope, $window, $q, $filter) {
        var that = $scope,
            baseUrl = location.protocol + '//' + location.host,
            currentSettings = null;

        that.userAccess = (function () {
            var self = {};

            self.hasStarterPlan = true;
            self.init = init;

            return self;

            function init(userData) {
                self.hasStarterPlan = userData.accessType > 0;
            }
        })();

        that.logo = (function () {
            var self = {};
            self.url = '';

            self.hasError = false;
            self.errorText = 'Unsupported image format';
            self.errorDescription = '(Supported formats: jpg, png, bmp)';
            self.isLoading = false;

            self.hasLogo = hasLogo;
            self.clear = clear;

            self.init = init;

            return self;

            function hasLogo() {
                return self.url !== '';
            }

            function clear() {
                self.url = '';
            }

            function init(logoSettings) {
                self.url = '';
                if (logoSettings && logoSettings.url) {
                    self.url = logoSettings.url;
                }
            }
        })(),

        that.trackingData = (function () {
            var self = {};

            self.enableXAPI = true,
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

        that.masteryScore = (function() {
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
                var _isLoaded = false,
                    _userTranslations = userTranslations;

                var that = this;

                that.code = code;
                that.name = name;
                that.isEditable = isEditable;
                that.resourcesUrl = resourcesUrl;
                that.resources = {};

                that.load = load;

                function load() {
                    if (_isLoaded) {
                        return $.when();
                    }

                    return loadLanguageResources(that.resourcesUrl).then(function (resources) {
                        that.resources = _userTranslations ? extend(_userTranslations, resources) : resources;
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

        angular.element($window).on('blur', saveChanges);

        function saveChanges() {
            var newSettings = getSettings();

            if (angular.equals(currentSettings, newSettings)) {
                return;
            }

            window.egApi.saveSettings(JSON.stringify(newSettings), null).done(function () {
                currentSettings = newSettings;
            });
        };

        function getSettings() {
            return {
                logo: {
                    url: that.logo.url
                },
                xApi: {
                    enabled: that.trackingData.enableXAPI,
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
                }
            };
        }

        //#region Image uploader

        var imageUploader = {
            apiUrl: baseUrl + '/storage/image/upload',
            maxFileSize: 10, //MB
            supportedExtensions: ['jpeg', 'jpg', 'png', 'bmp', 'gif'],
            somethingWentWrongMessage: {
                title: 'Something went wrong',
                description: 'Please, try again'
            },

            status: {
                default: function () {
                    that.logo.isLoading = false;
                    that.logo.hasError = false;
                    that.$apply();
                },
                fail: function (reason) {
                    that.logo.clear();
                    that.logo.isLoading = false;
                    that.logo.errorText = reason.title;
                    that.logo.errorDescription = reason.description;
                    that.logo.hasError = true;
                    that.$apply();
                },
                loading: function () {
                    that.logo.isLoading = true;
                    that.$apply();
                }
            },

            button: {
                enable: function () {
                    this.$input.attr('disabled', false).closest('.image-upload-button').removeClass('disabled');
                },
                disable: function () {
                    this.$input.attr('disabled', true).closest('.image-upload-button').addClass('disabled');
                },
                submit: function () {
                    this.$input[0].form.submit();
                    this.disable();
                    imageUploader.status.loading();
                },
                $input: $('#logoInput')
            },

            init: function () {
                imageUploader.button.$input.on('change', imageUploader.processFile);
                imageUploader.button.enable();
            },

            processFile: function () {
                if (!this.files) {
                    imageUploader.button.submit();
                    return;
                }
                if (this.files.length === 0) {
                    return;
                }

                var file = this.files[0],
                    fileExtension = file.name.split('.').pop().toLowerCase();

                if ($.inArray(fileExtension, imageUploader.supportedExtensions) === -1) {
                    imageUploader.status.fail({
                        title: 'Unsupported image format',
                        description: '(Allowed formats: ' + imageUploader.supportedExtensions.join(', ') + ')'
                    });
                    return;
                }
                if (file.size > imageUploader.maxFileSize * 1024 * 1024) {
                    imageUploader.status.fail({
                        title: 'File is too large',
                        description: '(Max file size: ' + imageUploader.maxFileSize + 'MB)'
                    });
                    return;
                }
                imageUploader.uploadFile(file);
            },

            uploadFile: function (file) {
                imageUploader.button.disable();
                imageUploader.status.loading();

                var formData = new FormData();
                formData.append('file', file);

                $.ajax({
                    url: imageUploader.apiUrl,
                    type: 'POST',
                    data: formData,
                    cache: false,
                    dataType: 'json',
                    processData: false, // Don't process the files
                    contentType: false, // Set content type to false as jQuery will tell the server its a query string request
                }).done(function (response) {
                    imageUploader.handleResponse(response);
                }).fail(function () {
                    imageUploader.status.fail(imageUploader.somethingWentWrongMessage);
                    imageUploader.button.enable();
                });
            },

            handleResponse: function (response) {
                try {
                    if (!response) {
                        throw 'Response is empty';
                    }

                    if (typeof response !== 'object') {
                        response = JSON.parse(response);
                    }

                    if (!response || !response.success || !response.data) {
                        throw 'Request is not successful';
                    }

                    that.logo.url = response.data.url;
                    that.$apply();
                    imageUploader.status.default();
                } catch (e) {
                    imageUploader.status.fail(imageUploader.somethingWentWrongMessage);
                } finally {
                    imageUploader.button.enable();
                }
            }
        };

        //#endregion Image uploader

        //#region Initialization

        var api = window.egApi;
        return api.init().then(function () {
            var manifest = api.getManifest(),
                user = api.getUser(),
                settings = api.getSettings();

            that.userAccess.init(user);
            that.logo.init(settings.logo);
            that.trackingData.init(settings.xApi);
            that.masteryScore.init(settings.masteryScore);
            that.languages.init(manifest.languages, settings.languages);

            if (that.userAccess.hasStarterPlan) {
                imageUploader.init();
            }

            currentSettings = getSettings();
            that.$applyAsync();

        }).fail(function () {
            api.sendNotificationToEditor('Settings are not initialized.', false);
        });

        //#endregion Initialization
    }

})();