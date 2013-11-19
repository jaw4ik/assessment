// selects the text in input if observable value is not null or empty
ko.bindingHandlers.selectTextBinding = {
    update: function (element, valueAccessor) {
        var value = valueAccessor();
        var valueUnwrapped = ko.unwrap(value);
        if (valueUnwrapped) {
            element.select();
        }
    }
};