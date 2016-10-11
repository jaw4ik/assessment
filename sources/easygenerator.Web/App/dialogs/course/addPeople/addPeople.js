import ko from 'knockout';
import _ from 'underscore';
import binder from 'binder';
import constants from 'constants';
import appEvents from 'durandal/events';
import notify from 'notify';
import localizationManager from 'localization/localizationManager';
import repository from 'repositories/courseRepository';

class AddPeople {
    constructor() {
        appEvents.includeIn(this);
        binder.bindClass(this);

        this.isShown = ko.observable(false);
        this.emails = ko.observableArray([]);
        this.isValid = ko.observable(true);
        this.sendInvitations = ko.observable(false);
        this.emailValidationPattern = constants.patterns.email;
        this.isProcessing = ko.observable(false);
    }

    show(courseId) {
        this.isProcessing(false);
        this.isValid(true);
        this.courseId = courseId;
        this.isShown(true);
        this.emails([]);
    }

    hide() {
        this.isShown(false);
        this.trigger(constants.dialogs.dialogClosed);
    }

    async submit() {
        try {
            if (this.emails().length === 0) {
                this.isValid(false);
                return;
            }

            this.isProcessing(true);
            await repository.grantAccess(this.courseId, this.emails(), this.sendInvitations());
            this.trigger(constants.messages.course.peopleAdded, this.emails(), this.sendInvitations());
            this.hide();
            this.emails.removeAll();
        } catch (reason) {
            notify.error(localizationManager.localize('responseFailed'));
            throw reason;
        } finally {
            this.isProcessing(false);
        }
    }

    sendInvitationsValueChanged(newValue) {
        this.sendInvitations(newValue);
    }
}

export default new AddPeople();