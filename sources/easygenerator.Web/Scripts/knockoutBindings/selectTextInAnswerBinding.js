ko.bindingHandlers.selectTextInAnswer = {
    init: function (element) {
        var $element = $(element),
            activeClass = 'active';

        $element.on('blur', function () {
            $element.removeClass(activeClass);
        });

        $element.click(function () {
            if (!$element.hasClass(activeClass)) {
                $element.selectText();
                $element.addClass(activeClass);
            }
        });
    }
};