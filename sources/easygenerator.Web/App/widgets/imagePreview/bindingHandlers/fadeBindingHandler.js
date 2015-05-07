define(['durandal/composition'], function (composition) {
    ko.bindingHandlers.fade = {
        init: function (element, valueAccessor) {
            var $element = $(element),
                data = valueAccessor() || {},
                value = ko.utils.unwrapObservable(data);

            if (value) {
                $element.stop().show();
            } else {
                $element.stop().hide();
            }
        },
        update: function (element, valueAccessor) {
            var $element = $(element),
                data = valueAccessor() || {},
                value = ko.utils.unwrapObservable(data);

            if (value) {
                $element.stop().fadeIn();
            } else {
                $element.stop().fadeOut();
            }
        }
    }

    composition.addBindingHandler('fade');
})
