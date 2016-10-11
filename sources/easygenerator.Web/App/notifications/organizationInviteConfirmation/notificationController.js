import app from 'durandal/app';
import constants from 'constants';
import binder from 'binder';
import userContext from 'userContext';
import Notification from 'notifications/organizationInviteConfirmation/notification';
import getInvitesCommand from './commands/getInvites';

class NotificationController {
    constructor() {
        binder.bindClass(this);
    }

    async execute() {
        app.on(constants.messages.organization.inviteCreated, this.pushNotification);
        app.on(constants.messages.organization.inviteRemoved, this.removeNotification);

        let invites = await getInvitesCommand.execute();
        _.each(invites, invite => {
            this.pushNotification(invite);
        });
    }

    pushNotification(invite) {
        if (invite.status !== constants.organizationUserStatus.waitingForEmailConfirmation) {
            return;
        }

        var notification = new Notification(constants.notification.keys.organizationInviteConfirmation + invite.id,
            invite.id,
            invite.organizationId,
            userContext.identity.firstname,
            invite.organizationAdminFirstName,
            invite.organizationAdminLastName,
            invite.organizationTitle);

        app.trigger(constants.notification.messages.push, notification);
    }

    removeNotification(inviteId) {
        app.trigger(constants.notification.messages.remove, constants.notification.keys.organizationInviteConfirmation + inviteId);
    }
}

export default new NotificationController();