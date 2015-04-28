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
                    action.apply(viewModel);
                } finally {
                    event.preventDefault();
                    event.returnValue = false;
                }
            });
        });
    }
};
