ko.bindingHandlers.dropDown = {

    init: function (element, valueAccessor) {
        var $element = $(element),
            hideOnDirectClick = valueAccessor().hideOnDirectClick,
            expandedClass = 'expanded',
            $html = $('html');

        $element.on('click', function () {
            if ($element.hasClass(expandedClass)) {
                if (hideOnDirectClick) {
                    hide();
                }
                return;
            } else {
                $element.addClass(expandedClass);

                _.defer(function () {
                    $html.on('click', hide);
                });
            }
        });

        function hide() {
            $element.removeClass(expandedClass);
            $html.off('click', hide);
        };
        
    }
};