ko.bindingHandlers.scrollToElement = {
    init: function () {
        var $scrollElement = $('.scrollToElement');
        if ($scrollElement.length != 0) {
            var targetTop = $scrollElement.offset().top;
            /*178px header size, 400px header and title and button "Add"*/
            if (targetTop >= 400) {
                $('html, body').animate({
                    scrollTop: targetTop - 178
                });
            }
            $scrollElement.removeClass('scrollToElement');
        } else {
            window.scroll(0, 0);
        }
    }
};