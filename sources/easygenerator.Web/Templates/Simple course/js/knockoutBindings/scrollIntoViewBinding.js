ko.bindingHandlers.scrollIntoView = {
    init: function () {
    },

    update: function (element, valueAccessor) {
        var $element = $(element),
            isVisible = ko.utils.unwrapObservable(valueAccessor());

        if (!isVisible)
            return;

        $('body').animate({
            scrollTop: $element.offset().top
        });
    }
};