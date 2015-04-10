ko.bindingHandlers.dropDown = {

    init: function (element) {
        var $element = $(element),
            expandedClass = 'expanded',
            $html = $('html');

        $element.on('click', function () {
            if ($element.hasClass(expandedClass)) {
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