define(['widgets/dialog/viewmodel', 'constants', 'dialogs/releaseNotes/commands/getReleaseNote',
        'dialogs/releaseNotes/commands/updateLastReadReleaseNote'],
        function (dialog, constants, getReleaseNote, updateLastReadReleaseNote) {
    'use strict';

    var viewmodel = {
        show: show,
        closed: closed,
        submit: submit,
        callbackAfterClose: null,
        releaseNotes: ko.observableArray([]),
        version: ''
    };

    return viewmodel;

    function show(callbackAfterClose) {
        getReleaseNote.execute().then(function (response) {
            if (_.isNullOrUndefined(response) || _.isEmptyOrWhitespace(response)) {
                dialog.close();
            } else {
                viewmodel.releaseNotes = response;
                viewmodel.callbackAfterClose = callbackAfterClose;
                dialog.show(viewmodel, constants.dialogs.releaseNote.settings);
                dialog.on(constants.dialogs.dialogClosed, viewmodel.closed);
            }
        });
    }

    function submit() {
        dialog.close();
    }

    function closed() {
        if (_.isFunction(viewmodel.callbackAfterClose)) {
            viewmodel.callbackAfterClose();
        }
        updateLastReadReleaseNote.execute();
        dialog.off(constants.dialogs.dialogClosed, viewmodel.closed);
    }
});