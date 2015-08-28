define(['widgets/dialog/viewmodel', 'constants', 'dialogs/releaseNotes/commands/getReleaseNote'], function (dialog, constants, getReleaseNote) {
    'use strict';

    var viewmodel = {
        show: show,
        closed: closed,
        callbackAfterClose: null,
        releaseNotes: ko.observableArray([])
    };

    return viewmodel;

    function show(callbackAfterClose) {
        getReleaseNote.execute().then(function (response) {
            if (_.isNullOrUndefined(response)) {
                viewmodel.closed();
            } else {
                viewmodel.releaseNotes(_.map(JSON.parse(response), function(value, key) {
                    return {
                        name: key,
                        notes: value
                    };
                }));
                viewmodel.callbackAfterClose = callbackAfterClose;
                dialog.show(viewmodel, constants.dialogs.releaseNote.settings);
                dialog.on(constants.dialogs.dialogClosed, viewmodel.closed);
            }
        });
    }

    function closed() {
        if (_.isFunction(viewmodel.callbackAfterClose)) {
            viewmodel.callbackAfterClose();
        }
        dialog.off(constants.dialogs.dialogClosed, closed);
    }
});