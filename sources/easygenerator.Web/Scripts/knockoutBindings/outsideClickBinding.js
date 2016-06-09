ko.bindingHandlers.outsideClick = {
    init: function (element, valueAccessor) {
        var $element = $(element),
            action = valueAccessor().action,
            debounce = valueAccessor().debounce;

        var clickHandler = function (event) {
            if (event.target === this) { // fix for dragula container, it fire unclear 'click' event with target 'html'
                return;
            }

            if (event.target === element || $element.has(event.target).length > 0) {
                return;
            }

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
    }
};