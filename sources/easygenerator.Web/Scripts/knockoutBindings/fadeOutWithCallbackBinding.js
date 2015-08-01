ko.bindingHandlers.fadeOutWithCallback = {
    update: function (element, valueAccessor) {
        var value = valueAccessor(),
            predicate = ko.unwrap(value.predicate),
            callback = value.callback,
            duration = value.duration || 500;

        if (predicate && _.isFunction(callback)) {
            $(element).fadeOut(duration, callback);
        }
    }
};