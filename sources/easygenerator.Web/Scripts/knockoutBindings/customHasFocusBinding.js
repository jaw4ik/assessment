(function (ko) {
    var originalHasfocusUpdate = ko.bindingHandlers.hasfocus.update;

    var hasfocusUpdatingProperty = '__ko_hasfocusUpdating';
    var hasfocusLastValue = '__ko_hasfocusLastValue';

    ko.bindingHandlers.hasfocus.update = function (element, valueAccessor, allBindings) {
        var value = !!ko.utils.unwrapObservable(valueAccessor()); //force boolean to compare with last value
        if (allBindings.has('scrollOnFocus') && value && !element[hasfocusUpdatingProperty] && element[hasfocusLastValue] !== value) {
            var $element = $(element);
            var $containter = $element.closest('#view_content');
            $containter = $containter.length ? $containter : $('html, body');
            $containter.scrollTo($element);
        }
        originalHasfocusUpdate(element, valueAccessor, allBindings);
    };
})(ko);

ko.bindingHandlers.scrollOnFocus = {
    init: function () { }
};
