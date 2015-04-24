ko.bindingHandlers.scrollToTop = {
    init: function (element, valueAccessor) {
        var $element = $(element);

        $element.bind('click', function () {
            $('html, body').animate({
                scrollTop: 0
            });
        });
    }
};