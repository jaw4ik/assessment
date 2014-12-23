(function () {
    'use strict';
    angular.module('settings', [])
        .controller('SettingsController', ['$scope', SettingsController])
        .directive('tabs', tabs)
        .directive('switchToggle', switchToggle);

    function SettingsController($scope) {
        var that = $scope,
            courseId = getUrlParameter('courseId'),
            templateId = getUrlParameter('templateId'),
            baseUrl = location.protocol + '//' + location.host,
            settingsUrl = baseUrl + '/api/course/' + courseId + '/template/' + templateId;

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

        that.isSaved = false;
        that.isFailed = false;
        that.advancedSettingsExpanded = false;
        that.toggleAdvancedSettings = function () {
            that.advancedSettingsExpanded = !that.advancedSettingsExpanded;
        };

        that.saveChanges = function () {
            var settings = {
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

        //#region Ajax requests

        $.ajax({
            cache: false,
            url: settingsUrl,
            dataType: 'json',
            success: function (json) {
                var defaultSettings = {xApi: {enabled: true, selectedLrs: 'default', lrs: {credentials: {}}}};
                var settings;
                try {
                    settings = JSON.parse(json.settings) || defaultSettings;
                } catch (e) {
                    settings = defaultSettings;
                }
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

    function switchToggle() {
        return {
            restrict: 'A',
            scope: {toggleValue: '='},
            link: function (scope, element) {
                var $element = $(element),
                    viewModel = initViewModel();

                viewModel.setInitialValue(scope.toggleValue);

                scope.$watch('toggleValue', function (value) {
                    viewModel.setInitialValue(value);
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
