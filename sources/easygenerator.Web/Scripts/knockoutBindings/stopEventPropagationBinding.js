ko.bindingHandlers.stopEventPropagation = {
    init: function (element, valueAccessor) {
        var $element = $(element),
            event = valueAccessor().event;

        $element.on(event, function (evt) {
            evt.stopPropagation();
        });
    }
};