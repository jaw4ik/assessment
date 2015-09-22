define(['widgets/dialog/viewmodel', 'constants', 'dialogs/releaseNotes/commands/getReleaseNote',
        'dialogs/releaseNotes/commands/updateLastReadReleaseNote', 'userContext'],
        function (dialog, constants, getReleaseNote, updateLastReadReleaseNote, userContext) {
    'use strict';

    var viewmodel = {
        show: show,
        closed: closed,
        submit: submit,
        callbackAfterClose: null,
        releaseNotes: ''
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
        updateLastReadReleaseNote.execute().then(function() {
            userContext.identity.showReleaseNote = false;
        });
        dialog.off(constants.dialogs.dialogClosed, viewmodel.closed);
    }
});