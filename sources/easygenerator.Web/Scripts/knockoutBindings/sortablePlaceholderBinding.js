ko.bindingHandlers.sortablePlaceholder = {
    cssClasses: {
        hover: 'hover',
        emptyPlaceHolder: 'empty'
    },
    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        var
            $element = $(element),
            value = ko.unwrap(valueAccessor()) || {},
            options = value.options || {},
            cssClasses = ko.bindingHandlers.sortablePlaceholder.cssClasses;

        if (value.placeholder) {
            options = {
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
                    ui.placeholder.height(ui.item.height());
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
            };
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