import ko from 'knockout';
import _ from 'underscore';
import constants from 'constants';
import app from 'durandal/app';
import router from 'plugins/router';
import userContext from 'userContext';
import eventTracker from 'eventTracker';
import createOrganizationCommand from 'organizations/commands/createOrganization';
import upgradeDialog from 'widgets/upgradeDialog/viewmodel';

class UserMenu {
    constructor() {
        this.username = null;
        this.useremail = null;
        this.avatarLetter = null;

        this.isFreeUser = ko.observable(false);
        this.isOrganizationAdmin = ko.observable(false);
        this.isOrganizationMember = ko.observable(false);
        this.hasOrganizationInvites = ko.observable(false);
        this.organizationTitle = ko.observable('');

        this.newEditor = ko.observable(false);
        this.switchEditor = function() {};
    }

    activate(data) {
        this.isFreeUser(userContext.hasFreeAccess() || userContext.hasTrialAccess());

        app.on(constants.messages.user.planChanged, this.userPlanChanged.bind(this));
        let organizationMembershipUpdatedProxy = this.organizationMembershipUpdated.bind(this);
        app.on(constants.messages.organization.created, organizationMembershipUpdatedProxy);
        app.on(constants.messages.organization.membershipStarted, organizationMembershipUpdatedProxy);
        app.on(constants.messages.organization.membershipFinished, organizationMembershipUpdatedProxy);

        var organizationInvitesUpdatedProxy = this.organizationInvitesUpdated.bind(this);
        app.on(constants.messages.organization.inviteCreated, organizationInvitesUpdatedProxy);
        app.on(constants.messages.organization.inviteRemoved, organizationInvitesUpdatedProxy);
        app.on(constants.messages.organization.userStatusUpdated, organizationInvitesUpdatedProxy);

        app.on(constants.messages.organization.titleUpdated, this.setOrganizationTitle.bind(this));

        if (_.isObject(userContext.identity)) {
            this.isOrganizationAdmin(userContext.identity.isOrganizationAdmin());
            this.isOrganizationMember(userContext.identity.isOrganizationMember());
            this.hasOrganizationInvites(userContext.identity.hasOrganizationInvites());
            this.setOrganizationTitle();

            this.username = _.isEmptyOrWhitespace(userContext.identity.fullname)
                ? userContext.identity.email
                : userContext.identity.fullname;

            this.avatarLetter = this.username.charAt(0);
            this.useremail = userContext.identity.email;
        }

        if (data) {
            this.newEditor(data.newEditor);
            if (_.isFunction(data.switchEditor)) {
                this.switchEditor = data.switchEditor;
            }
        }
    }

    userPlanChanged() {
        this.isFreeUser(userContext.hasFreeAccess() || userContext.hasTrialAccess());
    }

    openUpgradePlanUrl() {
        eventTracker.publish(constants.upgradeEvent, constants.upgradeCategory.userMenuInHeader);
        router.openUrl(constants.upgradeUrl);
    }

    async createOrganization() {
        if (!userContext.hasAcademyAccess()) {
            upgradeDialog.show(constants.dialogs.upgrade.settings.manageOrganization);
            return;
        }

        var organization = await createOrganizationCommand.execute();
        router.navigate('organizations/' + organization.id);
    }

    manageOrganization() {
        if (!userContext.hasAcademyAccess()) {
            upgradeDialog.show(constants.dialogs.upgrade.settings.manageOrganization);
            return;
        }

        var organization = userContext.identity.getFirstAdminAccessOrganization();
        if (organization) {
            router.navigate('organizations/' + organization.id);
        }
    }

    setOrganizationTitle() {
        let organizationNames = _.map(userContext.identity.organizations, organization => organization.title );
        this.organizationTitle(organizationNames.sort().join(', '));
    }

    organizationMembershipUpdated() {
        this.isOrganizationAdmin(userContext.identity.isOrganizationAdmin());
        this.isOrganizationMember(userContext.identity.isOrganizationMember());
        this.setOrganizationTitle();
    }

    organizationInvitesUpdated() {
        this.hasOrganizationInvites(userContext.identity.hasOrganizationInvites());
    }

    signOut() {
        window.auth.logout();
        router.setLocation(constants.signinUrl);
    }
}

export default new UserMenu();