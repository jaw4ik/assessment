define(['durandal/app', 'constants', 'widgets/dialog/viewmodel'], function (app, constants, dialog) {
    "use strict";
    
    var viewModel = {
        frameSrc: ko.observable(null),
        isLoading: ko.observable(true),

        show: show,
        frameLoaded: frameLoaded,
        onGetWindowMessage: onGetWindowMessage
    };

    dialog.on(constants.dialogs.dialogClosed, function () {
        app.trigger(constants.messages.branchtrack.dialogClosed);
    });

    return viewModel;

    function show(url) {
        viewModel.isLoading(true);
        viewModel.frameSrc(url);
        dialog.show(viewModel, constants.dialogs.branchtrack.settings);
    }

    function frameLoaded() {
        viewModel.isLoading(false);
    }

    function onGetWindowMessage(message) {
        var event = JSON.parse(message);
        if (!event || event.provider !== 'branchtrack') {
            return;
        }

        switch (event.type) {
            case 'branchtrack:apps:project':
                app.trigger(constants.messages.branchtrack.projectSelected, event.project_uid);
                dialog.close();
                break;
            case 'branchtrack:apps:close':
                dialog.close();
                break;
        }
    }

});