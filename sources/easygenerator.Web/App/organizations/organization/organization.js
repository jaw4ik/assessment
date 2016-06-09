import ko from 'knockout';
import _ from 'underscore';
import constants from 'constants';
import router from 'plugins/router';
import localizationManager from 'localization/localizationManager';
import getOrganizationCommand from 'organizations/commands/getOrganization';
import getOrganizationUsersCommand from 'organizations/commands/getOrganizationUsers';
import updateOrganizationTitleCommand from 'organizations/commands/updateOrganizationTitle';
import titleField from 'viewmodels/common/titleField';
import OrganizationUser from 'organizations/organization/OrganizationUser';
import removeUserDialog from 'dialogs/organizations/removeUser/removeUser';
import inviteOrganizationUsersDialog from 'dialogs/organizations/inviteUsers/inviteUsers';
import app from 'durandal/app';
import eventTracker from 'eventTracker';
import userContext from 'userContext';
import reinviteUserCommand from 'organizations/commands/reinviteUser';
import notify from 'notify';

const events = {
    editOrganizationTitle: 'Edit organization title'
},
    notFoundResult = { redirect: '404' };

const filterOptions = {
    all: 'organizationUsersFilter_all',
    inOrganization: 'organizationUsersFilter_inOrganization',
    acceptanceWaiting: 'organizationUsersFilter_acceptanceWaiting',
    registrationWaiting: 'organizationUsersFilter_registrationWaiting',
    declinedByUser: 'organizationUsersFilter_declinedByUser'
};

const sortingOptions = {
    recent: 'organizationUsersSorting_recent',
    alphanumeric: 'organizationUsersSorting_alphanumeric'
};

class Organization {
    constructor() {
        this.users = ko.observableArray([]);
        this.usersFilterValue = ko.observable('');

        this.filterOptions = filterOptions;
        this.filterOptionsValue = ko.observable();

        this.sortingOptions = sortingOptions;
        this.sortingOptionsValue = ko.observable();

        this.filteredUsers = ko.computed(() => {
            let resultUsersList = this.users();

            switch (this.filterOptionsValue()) {
                case filterOptions.inOrganization:
                    resultUsersList = _.filter(resultUsersList, user => user.isActivated());
                    break;
                case filterOptions.acceptanceWaiting:
                    resultUsersList = _.filter(resultUsersList, user => user.isRegistered() && user.isWaitingForAcceptance());
                    break;
                case filterOptions.registrationWaiting:
                    resultUsersList = _.filter(resultUsersList, user => !user.isRegistered());
                    break;
                case filterOptions.declinedByUser:
                    resultUsersList = _.filter(resultUsersList, user => user.isDeclined());
                    break;
            }

            if (!_.isEmpty(this.usersFilterValue())) {
                let filter = this.usersFilterValue().toLowerCase();
                resultUsersList = _.filter(resultUsersList, user =>
                    (user.fullName() && user.fullName().toLowerCase().indexOf(filter) >= 0) ||
                    (user.email && user.email.toLowerCase().indexOf(filter) >= 0));
            }

            switch (this.sortingOptionsValue()) {
                case sortingOptions.recent:
                    resultUsersList = _.sortBy(resultUsersList, user => user.createdOn).reverse();
                    break;
                case sortingOptions.alphanumeric:
                    resultUsersList = _.sortBy(resultUsersList, user => user.name());
                    break;
            }

            return resultUsersList;
        });

        this.isInviteUsersDialogShown = ko.observable(false);
    }

    async canActivate(organizationId) {
        if (!userContext.hasAcademyAccess()) {
            return notFoundResult;
        }

        try {
            let organization = await getOrganizationCommand.execute(organizationId);
            if(!organization.grantsAdminAccess)
                return notFoundResult;

            return true;
        } catch (reason) {
            return notFoundResult;
        }
    }

    async activate(organizationId) {
        this.isInviteUsersDialogShown(false);
        this.organizationId = organizationId;
        try {
            var organization = await getOrganizationCommand.execute(this.organizationId);
            this.title = titleField(organization.title, constants.validation.organizationTitleMaxLength, localizationManager.localize('organizationName'), this.getTitle.bind(this), this.updateTitle.bind(this));

            var users = await getOrganizationUsersCommand.execute(this.organizationId);
            var usersList = _.map(users, user => new OrganizationUser(user));

            this.users(usersList);

            this._organizationUserRemovedProxy = this.organizationUserRemoved.bind(this);
            this._organizationUsersAddedProxy = this.organizationUsersAdded.bind(this);
            this._inviteUsersDialogClosedProxy = this.inviteUsersDialogClosed.bind(this);

            app.on(constants.messages.organization.userRemoved + this.organizationId, this._organizationUserRemovedProxy);
            app.on(constants.messages.organization.usersAdded + this.organizationId, this._organizationUsersAddedProxy);
            inviteOrganizationUsersDialog.on(constants.dialogs.dialogClosed, this._inviteUsersDialogClosedProxy);
        }
        catch (reason) {
            router.activeItem.settings.lifecycleData = notFoundResult;
            throw reason;
        };
    }

    deactivate() {
        app.off(constants.messages.organization.userRemoved + this.organizationId, this._organizationUserRemovedProxy);
        app.off(constants.messages.organization.usersAdded + this.organizationId, this._organizationUsersAddedProxy);
        inviteOrganizationUsersDialog.off(constants.dialogs.dialogClosed, this._inviteUsersDialogClosedProxy);

        _.each(this.users(), user => user.deactivate());
    }

    async getTitle() {
        var organization = await getOrganizationCommand.execute(this.organizationId);
        return organization.title;
    }

    async updateTitle(title) {
        eventTracker.publish(events.editOrganizationTitle);

        await updateOrganizationTitleCommand.execute(this.organizationId, title);
    }
            
    async reinviteUser(user) {
        try {
            user.isReinviting(true);
            await reinviteUserCommand.execute(this.organizationId, user.id);
            user.isReinviting(false);
            notify.success(localizationManager.localize('invitesHaveBeenSucessfullySent'));
        } catch (reason) {
            user.isReinviting(false);
        }
    }

    inviteUsers() {
        if (this.isInviteUsersDialogShown()) {
            inviteOrganizationUsersDialog.hide();
            return;
        }

        this.isInviteUsersDialogShown(true);
        inviteOrganizationUsersDialog.show(this.organizationId);
    }

    inviteUsersDialogClosed() {
        this.isInviteUsersDialogShown(false);
    }

    deleteOrganizationUser(user) {
        removeUserDialog.show(this.organizationId, user.email, user.name());
    }

    organizationUserRemoved(userEmail) {
        this.users(
            _.filter(this.users(), user => user.email !== userEmail)
        );
    }

    organizationUsersAdded(users) {
        var newUsersList = _.map(users, user => new OrganizationUser(user));
        var usersList = _.union(this.users(), newUsersList);

        this.users(usersList);
    }
}

export default new Organization();