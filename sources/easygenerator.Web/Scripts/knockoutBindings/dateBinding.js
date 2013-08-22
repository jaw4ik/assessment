ko.bindingHandlers.date = {
    update: function (element, valueAccessor, allBindingsAccessor, viewModel) {

        var language = ko.unwrap(valueAccessor().language()) || 'en',
            value = valueAccessor().value,
            formatString = valueAccessor().formatString;
        
        var date = moment(value);
        date.lang(language);
        if (formatString == null) {
            $(element).text(date.format('DD/MM/YY'));
        }
        else {
            $(element).text(date.format(formatString));
        }
    }
};