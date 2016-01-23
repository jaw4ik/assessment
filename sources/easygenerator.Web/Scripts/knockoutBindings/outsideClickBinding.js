ko.bindingHandlers.outsideClick = {
    init: function (element, valueAccessor) {
        var $element = $(element),
            action = valueAccessor().action,
            debounce = valueAccessor().debounce;

        var clickHandler = function () {
            action();
        };

        if (debounce) {
            $('html').one('click', function () {
                $('html').bind('click', clickHandler);
            });
        } else {
            $('html').bind('click', clickHandler);
        }

        ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
            $('html').unbind('click', clickHandler);
        });

        $element.on('click', function (evt) {
            evt.stopPropagation();
        });
    }
};