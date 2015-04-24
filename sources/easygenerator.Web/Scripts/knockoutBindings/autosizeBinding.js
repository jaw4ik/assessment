ko.bindingHandlers.autosize = {
    init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var
            $element = $(element);

        $element.autosize({
            callback: function() {
                //fix bug in pugin jquery.autosize.js
                var height = $element.height(),
                    boxOffset = $element.outerHeight() - $element.height();
                $element.height(height - boxOffset - 1e-3);
            }
        });
        ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
            $element.trigger('autosize.destroy');
        });
    },
    update: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var text = ko.unwrap(valueAccessor().text),
            $element = $(element);

        if (text != $element.text()) {
            $element.text(text);
        }

        $element.trigger('autosize.resize');
    }
};