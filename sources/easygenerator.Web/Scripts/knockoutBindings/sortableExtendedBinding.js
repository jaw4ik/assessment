ko.bindingHandlers.sortableExtended = {
    cssClasses: {
        hover: 'hover',
        emptyPlaceHolder: 'empty'
    },
    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {

        var
            $element = $(element),
            value = ko.unwrap(valueAccessor()) || {},
            options = value.options || {},
            optionsStartHandler = options.start,
            optionsStopHandler = options.stop,
            cssClasses = ko.bindingHandlers.sortableExtended.cssClasses,
            maxHeight = value.maxHeight;

        if (_.isNumber(maxHeight) && maxHeight > 0) {
            options = {
                start: function (e, ui) {
                    if (_.isFunction(optionsStartHandler)) {
                        optionsStartHandler(e, ui);
                    }

                    $(document.activeElement).blur();
                },
                helper: function (e, ui) {
                    if (ui.height() > maxHeight) {
                        ui.height(maxHeight);
                    }
                    $element.sortable('option', 'cursorAt', { top: Math.floor(ui.height() / 2) });
                    return ui;
                },
                sort: function (event, ui) {
                    $element.sortable('refreshPositions');
                    ko.bindingHandlers.sortable.options.sort.call(this, event, ui);
                },
                stop: function (e, ui) {
                    ui.item.height('');
                    ui.placeholder.height('');

                    if (_.isFunction(optionsStopHandler)) {
                        optionsStopHandler(e, ui);
                    }
                }
            };
        }

        if (value.placeholder) {
            _.extend(options, {
                placeholder: {
                    element: function () {
                        var $placeholder = $(document).find(value.placeholder).clone();
                        return $placeholder[0];
                    },
                    update: function () {
                        return;
                    }
                },
                start: function (e, ui) {
                    if (optionsStartHandler) {
                        optionsStartHandler();
                    }

                    ui.placeholder.height(ui.item.height());
                },
                sort: function (event, ui) {
                    ko.bindingHandlers.sortable.options.sort.call(this, event, ui);
                },
                over: function (e, ui) {
                    if ($element.children().length == 1) {
                        $element.addClass(cssClasses.hover);
                        ui.placeholder.addClass(cssClasses.emptyPlaceHolder);
                    } else {
                        ui.placeholder.removeClass(cssClasses.emptyPlaceHolder);
                    }
                },
                out: function () {
                    $element.removeClass(cssClasses.hover);
                }
            });
        }

        if (value.options) {
            ko.utils.extend(value.options, options);
        } else {
            value.options = options;
        }

        return ko.bindingHandlers.sortable.init.call(this, element, function () {
            return value;
        }, allBindings, viewModel, bindingContext);
    },
    update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        var value = valueAccessor();
        return ko.bindingHandlers.sortable.update.call(this, element, valueAccessor, allBindings, viewModel, bindingContext);
    }
}