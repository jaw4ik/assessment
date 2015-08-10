define(['widgets/dialog/dialog', 'durandal/activator', 'constants'],
    function (dialog, activator, constants) {
        "use strict";

        var viewModel = {
            steps: ko.observableArray([]),
            activeStep: ko.observable(),

            show: show,
            close: close,
            closed: closed,
            navigate: navigate,
            navigateToNextStep: navigateToNextStep
        };
            //dialogActivator = activator.create();

        return viewModel;

        function show(steps, settings) {
            viewModel.steps.removeAll();

            _.each(steps, function (step) {
                viewModel.steps.push(step);
                //dialogActivator.activateItem(step);
            });

            viewModel.activeStep(viewModel.steps()[0]);

            dialog.show(viewModel, settings);
            dialog.on(constants.dialogs.dialogClosed, viewModel.closed);
        }

        function close() {
            dialog.close();
        }

        function closed() {
            //_.each(viewModel.steps, function (step) {
            //    dialogActivator.deactivateItem(step);
            //});

            viewModel.activeStep(null);
            dialog.off(constants.dialogs.dialogClosed, viewModel.closed);
        }

        function navigate(step) {
            if (step === viewModel.activeStep)
                return;

            viewModel.activeStep(step);
        }

        function navigateToNextStep() {
            var index = viewModel.steps.indexOf(viewModel.activeStep());
            if (index >= 0 && index < viewModel.steps().length - 1) {
                viewModel.activeStep(viewModel.steps()[index + 1]);
            }
        }
    });