define(['durandal/events', 'constants'],
    function (events, constants) {
        "use strict";

        var defaultSettings = {
            autoclose: false,
            containerCss: '',
            activate: true
        };

        var viewModel = {
            isShown: ko.observable(false),
            isCancelled: ko.observable(false),
            dialog: ko.observable(),

            show: show,
            close: close,
            settings: ko.observable(defaultSettings)
        };

        events.includeIn(viewModel);
        return viewModel;

        function show(dialog, settings) {
            viewModel.isCancelled(false);
            viewModel.dialog(dialog);

            if (settings) {
                viewModel.settings(_.defaults(settings, defaultSettings));
            }

            viewModel.isShown(true);
        }

        function close(isCancelled) {
            viewModel.isShown(false);
            viewModel.isCancelled(isCancelled);
            viewModel.dialog(null);
            viewModel.trigger(constants.dialogs.dialogClosed);
        }
    });