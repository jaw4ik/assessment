ko.bindingHandlers.containerHasFocus = {
    init: function (element, valueAccessor) {
        var $element = $(element),
            update = valueAccessor().update,
            hasFocus = valueAccessor().hasFocus;

        $element.on('focusin', function () {
            hasFocus(true);
        });

        $element.on('focusout', _.debounce(function () {
            if ($element.find(':focus').length == 0) {
                hasFocus(false);
                update();
            }
        }, 100));
    }
};