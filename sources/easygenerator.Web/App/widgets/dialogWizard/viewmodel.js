define(['durandal/activator', 'constants', 'durandal/events'],
    function (activator, constants, events) {
        "use strict";

        var defaultSettings = {
            autoclose: false,
            containerCss: ''
        };

        var viewModel = {
            steps: ko.observableArray([]),
            activeStep: ko.observable(),

            show: show,
            close: close,
            closed: closed,
            navigate: navigate,
            navigateToNextStep: navigateToNextStep,

            isShown: ko.observable(false),
            settings: ko.observable(defaultSettings)
        },
            dialogActivator = activator.create();

        events.includeIn(viewModel);
        return viewModel;

        function show(steps, settings) {
            viewModel.steps.removeAll();

            _.each(steps, function (step) {
                viewModel.steps.push(step);
            });

            viewModel.activeStep(viewModel.steps()[0]);

            if (settings) {
                viewModel.settings(_.defaults(settings, defaultSettings));
            }

            viewModel.isShown(true);
        }

        function close() {
            viewModel.isShown(false);
            viewModel.trigger(constants.dialogs.dialogClosed);

            viewModel.activeStep(null);
            _.each(viewModel.steps(), function (step) {
                dialogActivator.deactivateItem(step);
            });
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