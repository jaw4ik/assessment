define([], function () {
    "use strict";

    var viewModel = {
        value: ko.observable(''),
        isEditing: ko.observable(false),
        activate: activate,
        clear: clear
    };

    viewModel.hasValue = ko.computed(function () {
        return !_.isEmpty(viewModel.value());
    });

    return viewModel;

    function activate() {
        viewModel.value('');
        viewModel.isEditing(false);
    }

    function clear() {
        viewModel.value('');
    }
});