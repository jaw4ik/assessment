import ko from 'knockout';
import _ from 'underscore';
import constants from 'constants';
import appEvents from 'durandal/events';
import addUsersCommand from 'organizations/commands/addUsers';
import notify from 'notify';
import eventTracker from 'eventTracker';
import localizationManager from 'localization/localizationManager';

const events = {
    showDialog: 'Open \'invite users\' dialog',
    inviteUsers: 'Invite user(s) to an organization'
};

class InviteUsers{
    constructor() {
        this.isShown = ko.observable(false);
        this.emails = ko.observableArray([]);
        this.isValid = ko.observable(true);
        this.emailValidationPattern = constants.patterns.email;
        this.isProcessing = ko.observable(false);
        appEvents.includeIn(this);
    }

    show(organizationId) {
        eventTracker.publish(events.showDialog);

        this.isProcessing(false);
        this.isValid(true);
        this.organizationId = organizationId;
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

            eventTracker.publish(events.inviteUsers);
            this.isProcessing(true);
            await addUsersCommand.execute(this.organizationId, this.emails());
            this.isProcessing(false);
            this.hide();
            this.emails.removeAll();

        } catch (reason) {
            this.isProcessing(false);
            notify.error(localizationManager.localize('responseFailed'));
            throw reason;
        }
    }
}

export default new InviteUsers();