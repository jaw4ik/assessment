// selects the text in input if observable value is not null or empty
ko.bindingHandlers.selectText = {
    init: function (element) {
        var $element = $(element),
            input = 'input';

        $element.click(function () {
            if ($element.is(input)) {
                this.select();
            } else {
                $element.selectText();
            }
        });
    },
    update: function (element, valueAccessor) {
        var value = valueAccessor();
        var valueUnwrapped = ko.unwrap(value);
        if (valueUnwrapped) {
            element.select();
        }
    }
};