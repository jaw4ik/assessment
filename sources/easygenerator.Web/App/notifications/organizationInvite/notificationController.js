import userContext from 'userContext';
import constants from 'constants';
import Notification from 'notifications/organizationInvite/notification';
import app from 'durandal/app';
import getInvitesCommand from './commands/getInvites';

class NotificationController
{
    async execute() {
        app.on(constants.messages.organization.inviteCreated, this.pushNotification.bind(this));
        app.on(constants.messages.organization.inviteRemoved, this.removeNotification.bind(this));

        let invites = await getInvitesCommand.execute();
        _.each(invites, invite => {
            this.pushNotification(invite);
        });
    }

    pushNotification(invite) {
        var notification = new Notification(constants.notification.keys.organizationInvite + invite.id,
            invite.id,
            invite.organizationId,
            userContext.identity.firstname,
            invite.organizationAdminFirstName,
            invite.organizationAdminLastName,
            invite.organizationTitle);

        app.trigger(constants.notification.messages.push, notification);
    }

    removeNotification(inviteId) {
        app.trigger(constants.notification.messages.remove, constants.notification.keys.organizationInvite + inviteId);
    }
}

export default new NotificationController();