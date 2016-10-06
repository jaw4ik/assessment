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
        this.originUrl = constants.surveyPopup.originUrl;
        this.pageUrl = null;
    }
    show() {
        this.pageUrl = `${constants.surveyPopup.pageUrl}?email=${userContext.identity.email}&name=${userContext.identity.fullname}`;
        dialog.show(this, constants.dialogs.survey.settings);        
        dialog.on(constants.dialogs.dialogClosed, this.closed);
    }
    async submit() {
        await updateVersionCommand.execute();
        dialog.close();
    }
    closed() {
        userContext.identity.showSurveyPopup = false;
        dialog.off(constants.dialogs.dialogClosed, this.closed);
    }
}

export default new SurveyPopup();