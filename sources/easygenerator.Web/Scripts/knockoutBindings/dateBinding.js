ko.bindingHandlers.date = {
    update: function (element, valueAccessor, allBindingsAccessor, viewModel) {
        var language = ko.unwrap(valueAccessor().language) || 'en',
            value = ko.unwrap(valueAccessor().value),
            formatString = valueAccessor().formatString;
        
        if (_.isNullOrUndefined(value) || _.isNaN(value.valueOf()))
            return;

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