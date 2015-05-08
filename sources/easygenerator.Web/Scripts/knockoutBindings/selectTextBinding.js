// selects the text in input if observable value is not null or empty
ko.bindingHandlers.selectText = {
    init: function (element) {
        $(element).click(function () {
            this.select();
        });
    },
    update: function (element, valueAccessor) {
        var value = valueAccessor();
        var valueUnwrapped = ko.unwrap(value);
        if (valueUnwrapped) {
            _.defer(function() {
                element.select();
            });
        }
    }
};