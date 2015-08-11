define(['durandal/events', 'constants'],
    function (events, constants) {

        var viewModel = {
            title: ko.observable(''),
            maxLength: 250,
            isChanged: ko.observable(false),
            isEditing: ko.observable(),
            isSelected: ko.observable(),
            isProcessing: ko.observable(false),
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
            viewModel.isChanged(false);
            viewModel.isSelected(true);
            viewModel.isEditing(true);
            viewModel.isProcessing(false);
        }

        function submit() {
            if (!viewModel.isValid())
                return;

            viewModel.title(viewModel.title() && viewModel.title().trim());
            viewModel.trigger(constants.dialogs.stepSubmitted);
        }

        function beginEdit() {
            viewModel.isChanged(true);
            viewModel.isEditing(true);
        }

        function endEdit() {
            viewModel.isEditing(false);
        }

    });