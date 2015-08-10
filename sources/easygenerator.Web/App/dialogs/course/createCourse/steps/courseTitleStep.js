define(['durandal/events', 'constants'],
    function (events, constants) {

        var viewModel = {
            submit: submit
        };

        events.includeIn(viewModel);
        return viewModel;

        function submit() {
            viewModel.trigger(constants.dialogs.stepSubmitted);
        }

    });