ko.bindingHandlers.outsideClick = {
    init: function (element, valueAccessor) {
        var $element = $(element),
            action = valueAccessor().action;

        $('html').click(function () {
            action();
        });

        $element.on('click', function (evt) {
            evt.stopPropagation();
        });
    }
};