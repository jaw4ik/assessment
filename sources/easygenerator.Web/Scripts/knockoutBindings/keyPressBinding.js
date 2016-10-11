ko.bindingHandlers.keyPress = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
        var value = valueAccessor();

        if (_.isEmpty(value)) {
            return;
        }

        $(element).keypress(function (e) {
            ko.utils.objectForEach(value, function (keyCode, action) {
                if (e.keyCode !== keyCode) {
                    return;
                }

                try {
                    action.call(viewModel);
                } finally {
                    event.preventDefault();
                    event.returnValue = false;
                }
            });
        });
    }
};
