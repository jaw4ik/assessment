ko.bindingHandlers.selectTextInAnswer = {
    init: function (element) {
        var $element = $(element),
            activeClass = 'active';

        $element.on('blur', function () {
            $element.removeTextSelection();
            $element.removeClass(activeClass);
        });

        $element.focus(function () {
            if (!$element.hasClass(activeClass)) {
                element.select();
                $element.addClass(activeClass);

                // Work around WebKit's little problem
                function mouseUpHandler() {
                    // Prevent further mouseup intervention
                    $element.off("mouseup", mouseUpHandler);
                    return false;
                }

                $element.mouseup(mouseUpHandler);
            }
        });
    }
};