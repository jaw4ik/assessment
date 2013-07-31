define(function () {
    (function () {
        ko.bindingHandlers.slideToggle = {
            init: function (element, valueAccessor) {
                var value = valueAccessor();
                $(element).toggle(ko.utils.unwrapObservable(value));
            },
            update: function (element, valueAccessor) {
                var value = valueAccessor();
                ko.utils.unwrapObservable(value) ? $(element).slideDown('400') : $(element).slideUp('400');
            }
        };
    })();
});