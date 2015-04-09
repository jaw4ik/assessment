(function () {
    "use strict";

    angular.module('settings')
        .directive('tabs', tabs)
        .directive('switchToggle', switchToggle)
        .directive('disableDragAndDrop', disableDragAndDrop)
        .directive('spinner', spinner)
        .directive('number', number)
        .directive('fadeVisible', fadeVisible)
        .directive('dropdown', dropdown)
        .filter('keys', keys);

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
            scope: {
                spinnerValue: '='
            },
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
            scope: {
                numberValue: '='
            },
            link: function (scope, element) {
                var $element = $(element),
                    maxValue = 100;

                $element.on('keydown', function (e) {
                    var key = e.charCode || e.keyCode || 0;
                    return (key === 8 || key === 9 || key === 46 || (key >= 37 && key <= 40) ||
                        (key >= 48 && key <= 57) || (key >= 96 && key <= 105));
                });
                $element.on('keyup', function () {
                    if (scope.numberValue > maxValue) {
                        scope.numberValue = maxValue;
                        scope.$apply();
                    }
                });
            }
        };
    }

    function fadeVisible() {
        return {
            restrict: 'A',
            scope: {
                fadeVisibleValue: '='
            },
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
            scope: {
                toggleValue: '='
            },
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

    function dropdown() {
        return {
            restrict: 'E',
            scope: {
                options: '=',
                value: '=',
                optionsValue: '=',
                optionsText: '='
            },
            link: function (scope, $element) {
                var cssClasses = {
                    dropdown: 'dropdown',
                    disabled: 'disabled',
                    expanded: 'expanded',
                    optionsList: 'dropdown-options-list',
                    optionItem: 'dropdown-options-item',
                    currentItem: 'dropdown-current-item',
                    currentItemText: 'dropdown-current-item-text',
                    indicatorHolder: 'dropdown-indicator-holder',
                    indicator: 'dropdown-indicator'
                };

                $element.addClass(cssClasses.dropdown);

                var $currentItemElement = $('<div />')
                    .addClass(cssClasses.currentItem)
                    .appendTo($element);

                $('<div />')
                    .addClass(cssClasses.currentItemText)
                    .appendTo($currentItemElement);

                var $indicatorHolder = $('<div />')
                    .addClass(cssClasses.indicatorHolder)
                    .appendTo($currentItemElement);

                $('<span />')
                    .addClass(cssClasses.indicator)
                    .appendTo($indicatorHolder);

                $('<ul />')
                    .addClass(cssClasses.optionsList)
                    .appendTo($element);

                $currentItemElement.on('click', function (e) {
                    if ($element.hasClass(cssClasses.disabled)) {
                        return;
                    }

                    $currentItemElement.toggleClass(cssClasses.expanded);
                    e.stopPropagation();
                });

                var collapseHandler = function () {
                    $currentItemElement.removeClass(cssClasses.expanded);
                };

                $('html').bind('click', collapseHandler);
                $(window).bind('blur', collapseHandler);

                scope.$watchGroup(['options', 'value'], function (values) {
                    var $optionsListElement = $element.find('ul.' + cssClasses.optionsList),
                        $currentItemTextElement = $element.find('div.' + cssClasses.currentItemText);

                    var options = values[0],
                        value = values[1],
                        optionsText = scope.optionsText,
                        optionsValue = scope.optionsValue;

                    $optionsListElement.empty();

                    $.each(options, function (index, option) {
                        if (option[optionsValue] == value) {
                            $currentItemTextElement.text(option[optionsText]);
                            return;
                        }

                        $('<li />')
                            .addClass(cssClasses.optionItem)
                            .appendTo($optionsListElement)
                            .text(option[optionsText])
                            .on('click', function (e) {
                                scope.value = option[optionsValue];
                                scope.$apply();
                            });
                    });
                });
            }
        };
    }

    function keys() {
        return function(input) {
            if (!input) {
                return [];
            }
            return Object.keys(input);
        };
    }

})();