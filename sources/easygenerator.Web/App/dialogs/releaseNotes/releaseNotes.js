import _ from 'underscore';
import dialog from 'widgets/dialog/viewmodel';
import constants from 'constants';
import getReleaseNote from 'dialogs/releaseNotes/commands/getReleaseNote';
import updateLastReadReleaseNote from 'dialogs/releaseNotes/commands/updateLastReadReleaseNote';
import userContext from 'userContext';
import binder from 'binder';

'use strict';

class ReleaseNotes {
    constructor() {
        binder.bindClass(this);
        this.callbackAfterClose = null;
        this.releaseNotes = '';
    }

    async show(callbackAfterClose) {
        let response = await getReleaseNote.execute();
        if (_.isNullOrUndefined(response) || _.isEmptyOrWhitespace(response)) {
            dialog.close();
        } else {
            this.releaseNotes = response;
            this.callbackAfterClose = callbackAfterClose;
            dialog.show(this, constants.dialogs.releaseNote.settings);
            dialog.on(constants.dialogs.dialogClosed, this.closed);
        }
    }

    submit() {
        dialog.close();
    }

    async closed() {
        if (_.isFunction(this.callbackAfterClose)) {
            this.callbackAfterClose();
        }
        await updateLastReadReleaseNote.execute();
        userContext.identity.showReleaseNote = false;
        
        dialog.off(constants.dialogs.dialogClosed, this.closed);
    }
}

export default new ReleaseNotes();