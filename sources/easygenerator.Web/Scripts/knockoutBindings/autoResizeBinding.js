ko.bindingHandlers.autoResize = {
    init: function (element, valueAccessor) {
        var autoresizeEnabled = ko.unwrap(valueAccessor());
        if (!autoresizeEnabled) return;

        Q.fcall(function() {
            $(element).autosize();
        }).then(function() {
            ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                $(element).trigger('autosize.destroy');
            });
        }).then(function() {
            $(element).trigger('autosize.resize');
        });
    },
    update: function (element, valueAccessor) {
        var autoresizeEnabled = ko.unwrap(valueAccessor());
        if (!autoresizeEnabled) return;
        
        $(element).trigger('autosize.resize');
    }
};