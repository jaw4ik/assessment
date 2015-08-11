﻿define(['durandal/events', 'constants'],
    function (events, constants) {

        var viewModel = {
            title: ko.observable(''),
            maxLength: 250,
            isEditing: ko.observable(),
            isSelected: ko.observable(),
            beginEdit: beginEdit,
            endEdit: endEdit,
            caption: '',
            submit: submit,
            activate: activate
        };

        viewModel.isValid = ko.computed(function () {
            var length = viewModel.title() ? viewModel.title().trim().length : 0;
            return length > 0 && length <= viewModel.maxLength;
        });

        events.includeIn(viewModel);
        return viewModel;

        function activate() {
            viewModel.title('');
            viewModel.isEditing(true);
        }

        function submit() {
            viewModel.title(viewModel.title() && viewModel.title().trim());
            viewModel.trigger(constants.dialogs.stepSubmitted);
        }

        function beginEdit() {
            viewModel.isEditing(true);
        }

        function endEdit() {
            viewModel.isEditing(false);
        }

    });