ko.bindingHandlers.autoResize = {
    init: function (element, valueAccessor) {
        var autoresizeEnabled = ko.unwrap(valueAccessor());
        if (!autoresizeEnabled) return;

        $(element).autosize();
        $(element).trigger('autosize.resize');

        ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
            $(element).trigger('autosize.destroy');
        });
    },
    update: function(element) {
        $(element).trigger('autosize.resize');
    }
};