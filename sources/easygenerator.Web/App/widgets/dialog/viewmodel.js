define(['durandal/activator', 'constants', 'durandal/events'],
    function (activator, constants, events) {
        "use strict";

        var defaultSettings = {
            boundless: false,
            autoclose: false,
            containerCss: '',
            overlayCss: ''
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
        };

        events.includeIn(viewModel);
        return viewModel;

        function show(steps, settings) {
            if (viewModel.isShown()) {
                return;
            }
            
            viewModel.steps.removeAll();

            if (_.isArray(steps)) {
                _.each(steps, function(step) {
                    viewModel.steps.push(step);
                });
            } else {
                viewModel.steps.push(steps);
            }

            viewModel.activeStep(viewModel.steps()[0]);

            if (settings) {
                viewModel.settings(_.defaults(settings, defaultSettings));
            } else {
                viewModel.settings(defaultSettings);
            }

            viewModel.isShown(true);
        }

        function close() {
            viewModel.isShown(false);
        }

        function closed() {
            viewModel.trigger(constants.dialogs.dialogClosed);

            var dialogActivator = activator.create();
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