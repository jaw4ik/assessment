ko.bindingHandlers.placeholder = {
    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        $(element).placeholder();
    },
    update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
    }
};