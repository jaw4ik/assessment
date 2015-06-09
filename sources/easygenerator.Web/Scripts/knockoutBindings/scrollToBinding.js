ko.bindingHandlers.scrollToElement = {
    init: function (element) {
        var $scrollElement = $(element);
        $('html, body').animate({
            scrollTop: $scrollElement.offset().top - $scrollElement.height() * 2
        }, 300);
    }
};