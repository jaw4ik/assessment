ko.bindingHandlers.limitedLengthText = {
    init: function () {
    },
    update: function (element, valueAccessor) {
        var text = ko.unwrap(valueAccessor().text),
            maxLength = ko.unwrap(valueAccessor().maxLength),
            $element = $(element);

        if (text.length > maxLength) {
            text = text.substr(0, maxLength - 3) + "...";
        }

        if (text != $element.text()) {
            $element.text(text);
        }
    }
};