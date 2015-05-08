ko.bindingHandlers.outsideClick = {
    init: function (element, valueAccessor) {
        var $element = $(element),
            action = valueAccessor().action;

        var clickHandler = function() {
            action();
        };
        $('html').bind('click', clickHandler);

        ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
            $('html').unbind('click', clickHandler);
        });

        $element.on('click', function (evt) {
            evt.stopPropagation();
        });
    }
};