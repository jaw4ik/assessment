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

ko.bindingHandlers.keyPress = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
        var value = valueAccessor();

        if (_.isEmpty(value)) {
            return;
        }

        ko.utils.objectForEach(value, function (keyCode, action) {
            $(element).keypress(function (e) {
                if (e.keyCode != keyCode)
                    return;

                try {
                    var argsForAction = ko.utils.makeArray(arguments);
                    argsForAction.unshift(viewModel);
                    action.apply(viewModel, argsForAction);
                } finally {
                    event.preventDefault();
                    event.returnValue = false;
                }
            });
        });
    }
};
