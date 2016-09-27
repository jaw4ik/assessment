import _ from 'underscore';
import dialog from 'widgets/dialog/viewmodel';
import constants from 'constants';
import updateVersionCommand from 'dialogs/survey/commands/updateVersionCommand';
import userContext from 'userContext';
import binder from 'binder';

'use strict';

class SurveyPopup {

    constructor() {
        binder.bindClass(this);
        this.pageUrl = null
    }
    show() {
        this.pageUrl = `${constants.surveyPopup.pageUrl}?email=${userContext.identity.email}&name=${userContext.identity.fullname}`;
        dialog.show(this, constants.dialogs.survey.settings);
        window.addEventListener('message', this.submit);
        
        dialog.on(constants.dialogs.dialogClosed, this.closed);
    }
    async submit(response) {
        if (response.origin !== constants.surveyPopup.originUrl) {
            return;
        }
        await updateVersionCommand.execute();
        userContext.identity.showSurveyPopup = false;
        window.removeEventListener('message', this.submit);
        dialog.close();
    }
    closed() {
        dialog.off(constants.dialogs.dialogClosed, this.closed);
    }
}

export default new SurveyPopup();