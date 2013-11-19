ko.bindingHandlers.selectOnMouseOver = {
    init: function (element, valueAccessor) {

        var value = valueAccessor();
        var elementIdToSelect = ko.unwrap(value);

        $(element).on('mouseover', 'li', function () {
            $('#' + elementIdToSelect, this).select();
        });
    }
};