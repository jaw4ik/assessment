ko.bindingHandlers.withAnimated = {
    isFirstAnimation: false,
    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        ko.bindingHandlers.withAnimated.isFirstAnimation = true;
        return ko.bindingHandlers.with.init.call(this, element, valueAccessor, allBindings, viewModel, bindingContext);
    },
    update: function (element, valueAccessor) {
        var value = ko.utils.unwrapObservable(valueAccessor());
        if (ko.bindingHandlers.withAnimated.isFirstAnimation) {
            ko.bindingHandlers.withAnimated.isFirstAnimation = false;
        } else {
            $(element).stop().hide().fadeIn();
        }
    }
};