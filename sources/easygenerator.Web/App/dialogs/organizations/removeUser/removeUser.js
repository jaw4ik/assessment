import ko from 'knockout';
import constants from 'constants';
import dialog from 'widgets/dialog/viewmodel';
import removeOrganizationUserCommand from 'organizations/commands/removeUser';
import notify from 'notify';
import localizationManager from 'localization/localizationManager';
import eventTracker from 'eventTracker';

let events = {
    removeUserFromOrganization: 'Remove user from organization'
};

class RemoveUserDialog{
    constructor() {
        this.isRemoving = ko.observable(false);
    }

    show(organizationId, userEmail, userName) {
        this.organizationId = organizationId;
        this.userEmail = userEmail;
        this.userName = userName;
        this.isRemoving(false);
        dialog.show(this, constants.dialogs.deleteItem.settings);
    }

    cancel() {
        dialog.close();
    }

    async removeUser() {
        eventTracker.publish(events.removeUserFromOrganization);
        this.isRemoving(true);
        try {
            await removeOrganizationUserCommand.execute(this.organizationId, this.userEmail);
            this.isRemoving(false);
            dialog.close();
        } catch (e) {
            this.isRemoving(false);
            notify.error(localizationManager.localize('responseFailed'));
        }
    }
}

export default new RemoveUserDialog();