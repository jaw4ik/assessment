ko.bindingHandlers.outsideClick = {
    init: function (element, valueAccessor) {
        var $element = $(element),
            $document = $(document),
            $html = $('html'),

            action = valueAccessor().action,
            debounce = valueAccessor().debounce;

        var clickHandler = function (event) {
            if ($document.has(element).length === 0) {
                $html.unbind('click', clickHandler);
                return;
            }

            if (event.target === this) { // fix for dragula container, it fire unclear 'click' event with target 'html'
                return;
            }

            if (event.target === element || $element.has(event.target).length > 0) {
                return;
            }

            if (!_.isUndefined(action)) { action(); }
        };

        if (debounce) {
            $html.one('click', function () {
                $html.bind('click', clickHandler);
            });
        } else {
            $html.bind('click', clickHandler);      
        }

        ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
            $html.unbind('click', clickHandler);
        });
    }
};