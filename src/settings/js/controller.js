(function () {
    "use strict";

    angular.module('settings', [])
        .controller('SettingsController', ['$scope', '$window', '$q', '$filter', SettingsController]);

    function SettingsController($scope, $window, $q, $filter) {
        var that = $scope,
            baseUrl = location.protocol + '//' + location.host,
            currentSettings = null;

        that.hasStarterPlan = true;

        that.logo = (function () {
            var logo = {};
            logo.url = '';

            logo.hasLogo = function () {
                return logo.url !== '';
            };
            logo.clear = function () {
                logo.url = '';
            };
            logo.hasError = false;
            logo.errorText = 'Unsupported image format';
            logo.errorDescription = '(Supported formats: jpg, png, bmp)';
            logo.isLoading = false;

            return logo;
        })(),

        that.trackingData = (function () {
            var data = {};
            data.enableXAPI = true,
            data.lrsOptions = [
                {
                    key: 'default',
                    text: 'easygenerator (recommended)'
                },
                {
                    key: 'custom',
                    text: 'custom LRS'
                }
            ];
            data.selectedLrs = data.lrsOptions[0].key;

            data.lrsOptions.forEach(function (lrsOption) {
                lrsOption.isSelected = function () {
                    return data.selectedLrs === lrsOption.key;
                };

                lrsOption.select = function () {
                    data.lrsOptions.forEach(function (item) {
                        item.isSelected(false);
                    });
                    lrsOption.isSelected(true);
                    data.selectedLrs = lrsOption.key;
                };
            });

            data.customLrsEnabled = function () {
                return data.enableXAPI && data.selectedLrs !== data.lrsOptions[0].key;
            };

            data.lrsUrl = '';
            data.authenticationRequired = false;
            data.lapLogin = '';
            data.lapPassword = '';

            data.credentialsEnabled = function () {
                return data.customLrsEnabled() && data.authenticationRequired;
            };

            data.statements = {
                started: true,
                stopped: true,
                experienced: true,
                mastered: true,
                answered: true,
                passed: true,
                failed: true
            };

            data.advancedSettingsExpanded = false;
            data.toggleAdvancedSettings = function () {
                data.advancedSettingsExpanded = !data.advancedSettingsExpanded;
            };

            return data;
        })();

        that.masteryScore = '';

        that.languages = (function () {
            var self = {},
                defaultLanguageCode = 'en',
                customLanguageCode = 'xx';

            self.languagesList = [];
            self.selectedLanguageCode = '';

            self.getSelectedLanguageResources = getSelectedLanguageResources;
            self.isSelectedLanguageEditable = isSelectedLanguageEditable;
            self.getCustomTranslations = getCustomTranslations;

            self.init = init;

            return self;

            function getSelectedLanguageResources() {
                var selectedLanguage = _getLanguage(self.selectedLanguageCode);
                return selectedLanguage ? selectedLanguage.getResources() : [];
            }

            function isSelectedLanguageEditable() {
                var selectedLanguage = _getLanguage(self.selectedLanguageCode);
                return selectedLanguage ? selectedLanguage.isEditable : false;
            }

            function getCustomTranslations() {
                var customLanguage = _getLanguage(customLanguageCode);
                return customLanguage ? customLanguage.getNotMappedResources() : {};
            }

            function init(languages, languagesSettings) {
                languages.forEach(function (language) {
                    self.languagesList.push(new Language(language.code, language.name, false, language.resources));
                });

                var customLanguage = new Language(customLanguageCode, 'Custom', true);
                if (languagesSettings && languagesSettings.customTranslations) {
                    customLanguage.setResources(languagesSettings.customTranslations);
                } else {
                    var defaultLanguage = _getLanguage(defaultLanguageCode);
                    var defaultResources = defaultLanguage ? defaultLanguage.getNotMappedResources() : [];
                    customLanguage.setResources(defaultResources);
                }

                self.languagesList.push(customLanguage);
                self.selectedLanguageCode = (languagesSettings && languagesSettings.selected) ? languagesSettings.selected : defaultLanguageCode;
            }

            function _getLanguage(code) {
                return $filter('filter')(self.languagesList, { code: code })[0];
            }

            function Language(code, name, isEditable, resources) {
                this.code = code;
                this.name = name;
                this.isEditable = isEditable;

                this._resources = [];
                this.setResources = function (res) {
                    this._resources = Array.isArray(res) ? res : map(res);
                };
                this.getResources = function () {
                    return this._resources;
                };
                this.getNotMappedResources = function () {
                    return unmap(this._resources);
                };

                if (resources) {
                    this.setResources(resources);
                }

                function map(resourcesObject) {
                    var arr = [];

                    if (resourcesObject) {
                        Object.keys(resourcesObject).forEach(function (key) {
                            arr.push({ key: key, value: resourcesObject[key] });
                        });
                    }

                    return arr;
                }

                function unmap(resourcesArray) {
                    var translationsObj = {};

                    if (resourcesArray) {
                        resourcesArray.forEach(function (translation) {
                            translationsObj[translation.key] = translation.value;
                        });
                    }

                    return translationsObj;
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
                currentSettings = settings;
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
                    score: that.masteryScore || 0
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

            initUserAccess(user);
            initXApi(settings.xApi);
            initLogo(settings.logo);
            initMasteryScore(settings.masteryScore);

            if (that.hasStarterPlan) {
                imageUploader.init();
            }

            return loadLanguages(manifest.languages).then(function (loadedLanguages) {
                that.languages.init(loadedLanguages, settings.languages);

                currentSettings = getSettings();
                
                that.$applyAsync();
            });

            function initUserAccess(userData) {
                that.hasStarterPlan = userData.accessType > 0;
            }

            function initXApi(xApiSettings) {
                that.trackingData.enableXAPI = xApiSettings.enabled || false;
                var defaultLrs = xApiSettings.enabled ? 'custom' : 'default';
                that.trackingData.selectedLrs = xApiSettings.selectedLrs || defaultLrs;
                that.trackingData.lrsUrl = xApiSettings.lrs.uri || '';
                that.trackingData.authenticationRequired = xApiSettings.lrs.authenticationRequired || false;
                that.trackingData.lapLogin = xApiSettings.lrs.credentials.username || '';
                that.trackingData.lapPassword = xApiSettings.lrs.credentials.password || '';

                var key;
                if (xApiSettings.allowedVerbs) {
                    for (key in that.trackingData.statements) {
                        if (that.trackingData.statements.hasOwnProperty(key)) {
                            that.trackingData.statements[key] = xApiSettings.allowedVerbs.indexOf(key) > -1;
                        }
                    }
                }
            }

            function initLogo(logoSettings) {
                that.logo.url = '';
                if (logoSettings && logoSettings.url) {
                    that.logo.url = logoSettings.url;
                }
            }

            function initMasteryScore(masteryScoreSettings) {
                if (masteryScoreSettings && masteryScoreSettings.score >= 0 && masteryScoreSettings.score <= 100) {
                    that.masteryScore = masteryScoreSettings.score;
                } else {
                    that.masteryScore = 100;
                }
            }

            function loadLanguages(languagesList) {
                var promises = [];

                languagesList.forEach(function (language) {
                    promises.push(loadLanguageResources(language.url).then(function (resources) {
                        language.resources = resources;
                        return language;
                    }));
                });

                return $q.all(promises);

                function loadLanguageResources(url) {
                    return $.ajax({
                        url: url,
                        dataType: 'json',
                        contentType: 'application/json'
                    });
                }
            }

        }).fail(function () {
            api.sendNotificationToEditor('Settings are not initialized.', false);
        });

        //#endregion Initialization
    }

})();