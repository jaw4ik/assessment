(function () {
    'use strict';
    angular.module('settings', [])
        .controller('SettingsController', ['$scope', SettingsController])
        .directive('tabs', tabs)
        .directive('switchToggle', switchToggle)
        .directive('disableDragAndDrop', disableDragAndDrop)
        .directive('spinner', spinner)
        .directive('number', number)
        .directive('fadeVisible', fadeVisible);

    function SettingsController($scope) {
        var that = $scope,
            courseId = getUrlParameter('courseId'),
            templateId = getUrlParameter('templateId'),
            baseUrl = location.protocol + '//' + location.host,
            settingsUrl = baseUrl + '/api/course/' + courseId + '/template/' + templateId,
            starterAccessType = 1;

        that.trackingData = (function () {
            var data = {};

            data.enableXAPI = true,
                data.lrsOptions = [
                    { key: 'default', text: 'easygenerator (recommended)' },
                    { key: 'custom', text: 'custom LRS' }
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

            return data;
        })();

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

        that.hasStarterPlan = true;
        that.masteryScore = '';

        that.isSaved = false;
        that.isFailed = false;
        that.advancedSettingsExpanded = false;
        that.toggleAdvancedSettings = function () {
            that.advancedSettingsExpanded = !that.advancedSettingsExpanded;
        };

        that.saveChanges = function () {
            var settings = {
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
                    score: that.masteryScore
                }
            };

            that.isFailed = false;
            that.isSaved = false;

            $.post(settingsUrl, {settings: JSON.stringify(settings)})
                .done(function () {
                    that.isSaved = true;
                    that.$apply();
                })
                .fail(function () {
                    that.isFailed = true;
                    that.$apply();
                });
        };

        //#region Image uploader

        var imageUploader = {
            apiUrl: baseUrl + '/storage/image/upload',
            maxFileSize: 10, //MB
            supportedExtensions: ['jpeg', 'jpg', 'png', 'bmp', 'gif'],
            somethingWentWrongMessage: {title: 'Something went wrong', description: 'Please, try again'},

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
                    imageUploader.status.fail({title: 'Unsupported image format', description: '(Allowed formats: ' + imageUploader.supportedExtensions.join(', ') + ')'});
                    return;
                }
                if (file.size > imageUploader.maxFileSize * 1024 * 1024) {
                    imageUploader.status.fail({title: 'File is too large', description: '(Max file size: ' + imageUploader.maxFileSize + 'MB)'});
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

        //#region Ajax requests

        $.ajax({
            cache: false,
            url: settingsUrl,
            dataType: 'json',
            success: function (json) {
                var defaultSettings = {xApi: {enabled: true, selectedLrs: 'default', lrs: {credentials: {}}}, masteryScore: {}};
                var settings;
                try {
                    settings = JSON.parse(json.settings) || defaultSettings;
                } catch (e) {
                    settings = defaultSettings;
                }

                setxApi();
                setLogo();
                setMasteryScore();

                that.$apply();

                function setxApi() {
                    that.trackingData.enableXAPI = settings.xApi.enabled || false;
                    var defaultLrs = settings.xApi.enabled ? 'custom' : 'default';
                    that.trackingData.selectedLrs = settings.xApi.selectedLrs || defaultLrs;
                    that.trackingData.lrsUrl = settings.xApi.lrs.uri || '';
                    that.trackingData.authenticationRequired = settings.xApi.lrs.authenticationRequired || false;
                    that.trackingData.lapLogin = settings.xApi.lrs.credentials.username || '';
                    that.trackingData.lapPassword = settings.xApi.lrs.credentials.password || '';

                    if (settings.xApi.allowedVerbs) {
                        $.each(that.trackingData.statements, function (key) {
                            that.trackingData.statements[key] = $.inArray(key, settings.xApi.allowedVerbs) > -1;
                        });
                    }
                }

                function setLogo() {
                    that.logo.url = '';
                    if (settings.logo && settings.logo.url) {
                        that.logo.url = settings.logo.url;
                    }
                }

                function setMasteryScore() {
                    if (typeof settings.masteryScore !== 'undefined' && settings.masteryScore.score >= 0 && settings.masteryScore.score <= 100) {
                        that.masteryScore = settings.masteryScore.score;
                    } else {
                        that.masteryScore = 100;
                    }
                }
            },
            error: function () {
                that.masteryScore = 100;
                that.$apply();
            }
        });

        $.ajax({
            url: baseUrl + '/api/identify',
            type: 'POST',
            contentType: 'application/json',
            dataType: 'json',
            success: function (user) {
                if (user.hasOwnProperty('subscription') && user.subscription.hasOwnProperty('accessType')) {
                    var hasStarterAccess = user.subscription.accessType >= starterAccessType && new Date(user.subscription.expirationDate) >= new Date();
                    that.hasStarterPlan = hasStarterAccess;

                    if (hasStarterAccess) {
                        imageUploader.init();
                    }
                } else {
                    that.hasStarterPlan = false;
                }

                that.$apply();
            },
            error: function () {
                that.hasStarterPlan = false;
                that.$apply();
            }
        });

        //#endregion Ajax requests

        function getUrlParameter(name) {
            return decodeURI(
                (new RegExp(name + '=' + '(.+?)(&|$)').exec(location.search) || [, null])[1]
            );
        }
    }

    //#region Directives

    function tabs() {
        return {
            restrict: 'A',
            link: function (scope, element) {
                var $element = $(element),
                    dataTabLink = 'data-tab-link',
                    dataTab = 'data-tab',
                    activeClass = 'active',
                    $tabLinks = $element.find('[' + dataTabLink + ']'),
                    $tabs = $element.find('[' + dataTab + ']');

                $tabs.hide();

                $tabLinks.first().addClass(activeClass);
                $tabs.first().show();

                $tabLinks.each(function (index, item) {
                    var $item = $(item);
                    $item.on('click', function () {
                        var key = $item.attr(dataTabLink),
                            currentContentTab = $element.find('[' + dataTab + '="' + key + '"]');
                        $tabLinks.removeClass(activeClass);
                        $item.addClass(activeClass);
                        $tabs.hide();
                        currentContentTab.show();
                    });
                });
            }
        };
    }

    function disableDragAndDrop() {
        return {
            restrict: 'A',
            link: function (scope, element) {
                $(element).on('dragstart', function (event) {
                    event.preventDefault();
                });
            }
        };
    }

    function spinner() {
        return {
            restrict: 'A',
            scope: {spinnerValue: '='},
            link: function (scope, element) {
                $(element)
                    .spinner('changed', function (e, newValue) {
                        scope.spinnerValue = newValue;
                        scope.$apply();
                    });
            }
        };
    }

    function number() {
        return {
            restrict: 'A',
            link: function (scope, element) {
                var $element = $(element),
                    maxValue = 100;

                $element.on('keydown', function (e) {
                    var key = e.charCode || e.keyCode || 0;
                    return (key === 8 || key === 9 || key === 46 || (key >= 37 && key <= 40) ||
                    (key >= 48 && key <= 57) || (key >= 96 && key <= 105));
                });
                $element.on('keyup', function () {
                    if ($(this).val() > maxValue) {
                        $(this).val(maxValue);
                    }
                });
            }
        };
    }

    function fadeVisible() {
        return {
            restrict: 'A',
            scope: {fadeVisibleValue: '='},
            link: function (scope, element) {
                var $element = $(element);

                $element.toggle(scope.fadeVisibleValue);

                scope.$watch('fadeVisibleValue', function (value) {
                    if (value) {
                        $element.fadeIn();
                    } else {
                        $element.fadeOut();
                    }
                });
            }
        };
    }

    function switchToggle() {
        return {
            restrict: 'A',
            scope: {toggleValue: '='},
            link: function (scope, element) {
                var $element = $(element),
                    viewModel = initViewModel();

                viewModel.setInitialValue(scope.toggleValue);

                scope.$watch('toggleValue', function (value) {
                    viewModel.updateValue(value);
                });

                onClick(function () {
                    viewModel.toggle();
                    scope.toggleValue = !scope.toggleValue;
                    scope.$apply();
                });

                function initViewModel() {
                    var $wrapper = $('.switch-toggle-wrapper', $element);

                    function setInitialValue(value) {
                        setElementValue(value);
                        updateElementPosition(value);
                    }

                    function toggle() {
                        var value = getValue();
                        setElementValue(!value);

                        $wrapper.stop().animate({
                            marginLeft: calculateElementLeftMargin(!value)
                        }, 250);
                    }

                    function getValue() {
                        return $element.hasClass('on');
                    }

                    function updateValue(value) {
                        if (getValue() !== value) {
                            setInitialValue(value);
                        }
                    }

                    function setElementValue(value) {
                        $element.toggleClass('on', value);
                        $element.toggleClass('off', !value);
                    }

                    function updateElementPosition(value) {
                        $wrapper.css('margin-left', calculateElementLeftMargin(value) + 'px');
                    }

                    function calculateElementLeftMargin(value) {
                        return value ? 0 : $element.height() - $element.width();
                    }

                    return {
                        setInitialValue: setInitialValue,
                        updateValue: updateValue,
                        toggle: toggle
                    };
                }

                function onClick(handler) {
                    var isMouseDownFired = false;

                    $element.mousedown(function (event) {
                        if (event.which !== 1) {
                            return;
                        }

                        isMouseDownFired = true;
                        handler();
                    });

                    $element.click(function () {
                        if (isMouseDownFired) {
                            isMouseDownFired = false;
                            return;
                        }

                        handler();
                    });
                }
            }
        };
    }

    //#endregion Directives

}());
