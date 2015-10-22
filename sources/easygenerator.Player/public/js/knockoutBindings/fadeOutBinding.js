ko.bindingHandlers.fadeOut = {
    update: function (element, valueAccessor) {
        var value = valueAccessor(),
            predicate = ko.unwrap(value.predicate),
            duration = value.duration || 1000;
        if (predicate) {
            $(element).fadeOut(duration);
        }
    }
};