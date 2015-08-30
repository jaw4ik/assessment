define(['widgets/dialog/viewmodel', 'constants', 'dialogs/releaseNotes/commands/getReleaseNote',
        'dialogs/releaseNotes/commands/updateLastReadReleaseNote', 'localization/localizationManager'],
        function (dialog, constants, getReleaseNote, updateLastReadReleaseNote, localizationManager) {
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
            if (_.isNullOrUndefined(response)) {
                dialog.close();
            } else {
                viewmodel.version = response.version;
                viewmodel.releaseNotes(_.map(JSON.parse(response.notes), function (value, key) {
                    return {
                        key: key,
                        name: mapReleaseNoteKey(key),
                        notes: value
                    };
                }));
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

    function mapReleaseNoteKey(key) {
        switch (key) {
            case 'added':
                return 'Added';
            case 'fixed':
                return 'Fixed';
            case 'futureFeatures':
                return 'What we are working on';
            default:
                return '';
        }
    }
});