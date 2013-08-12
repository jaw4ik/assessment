ko.bindingHandlers.autoResize = {
    init: function (element, valueAccessor) {
        
        var value = ko.unwrap(valueAccessor());
        if (value != true) return;

        Q(element)
            .then(
                function (input) { return $(input).load(); }
            )
            .then(
                function (input) { input.autosize(); }
            );

    }
};