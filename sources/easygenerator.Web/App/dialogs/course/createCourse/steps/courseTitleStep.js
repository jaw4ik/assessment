define(['durandal/events', 'constants'],
    function (events, constants) {

        var viewModel = {
            title: ko.observable(''),
            maxLength: constants.validation.courseTitleMaxLength,
            isEditing: ko.observable(),
            isChanged: ko.observable(),
            isProcessing: ko.observable(false),
            beginEdit: beginEdit,
            endEdit: endEdit,
            submit: submit,
            activate: activate,
            deactivate: deactivate,
            titleSubscription: undefined
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
            viewModel.isEditing(true);
            viewModel.isProcessing(false);
            viewModel.titleSubscription = viewModel.title.subscribe(titleChanged);
        }

        function deactivate() {
            viewModel.titleSubscription.dispose();
        }

        function submit() {
            if (!viewModel.isValid()) {
                viewModel.isChanged(true);
                return;
            }

            viewModel.title(viewModel.title() && viewModel.title().trim());
            viewModel.trigger(constants.dialogs.stepSubmitted);
        }

        function beginEdit() {
            viewModel.isEditing(true);
        }

        function endEdit() {
            viewModel.isEditing(false);
        }

        function titleChanged() {
            viewModel.isChanged(true);
        }

    });