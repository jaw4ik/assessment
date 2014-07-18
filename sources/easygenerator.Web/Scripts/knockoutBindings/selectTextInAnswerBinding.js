ko.bindingHandlers.selectTextInAnswer = {
    init: function (element) {
        var $element = $(element),
            activeClass = 'active';

        $element.on('blur', function () {
            $element.removeTextSelection();
            $element.removeClass(activeClass);
        });

        $element.click(function () {
            if (!$element.hasClass(activeClass)) {
                element.select();
                $element.addClass(activeClass);
            }
        });
    }
};