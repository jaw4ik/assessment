import ko from 'knockout';
import app from 'durandal/app';
import acceptInviteCommand from './commands/acceptInvite';
import declineInviteCommand from './commands/declineInvite';
import constants from 'constants';

export default class Notification{
    constructor(key, id, organizationId, userFirstname, organizationAdminFirstname, organizationAdminLastname, organizationTitle) {
        this.key = key;
        this.id = id;
        this.organizationId = organizationId;
        this.userFirstname = userFirstname;
        this.userAvatarLetter = userFirstname.charAt(0);
        this.organizationAdminFirstname = organizationAdminFirstname;
        this.organizationAdminLastname = organizationAdminLastname;
        this.organizationTitle = ko.observable(organizationTitle);

        this.isAccepting = ko.observable(false);
        this.isDeclining = ko.observable(false);

        this._organizationTitleUpdatedProxy = this.organizationTitleUpdated.bind(this);
    }

    on() {
        app.on(constants.messages.organization.titleUpdated, this._organizationTitleUpdatedProxy);
    }

    off() {
        app.off(constants.messages.organization.titleUpdated, this._organizationTitleUpdatedProxy);
    }

    organizationTitleUpdated(organizationId, title) {
        if (this.organizationId !== organizationId)
            return;

        this.organizationTitle(title);
    }

    async accept() {
        this.isAccepting(true);

        try {
            await acceptInviteCommand.execute(this.id);
            app.trigger(constants.notification.messages.remove, this.key);
        } catch (reason) {
            this.isAccepting(false);
        }
    }

    async decline() {
        this.isDeclining(true);

        try {
            await declineInviteCommand.execute(this.id);
            app.trigger(constants.notification.messages.remove, this.key);
        } catch (reason) {
            this.isDeclining(false);
        }
    }
}