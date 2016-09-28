import ko from 'knockout';
import app from 'durandal/app';
import binder from 'binder';
import constants from 'constants';

export default class Notification {
    constructor(key, id, organizationId, userFirstname, organizationAdminFirstname, organizationAdminLastname, organizationTitle) {
        binder.bindClass(this);

        this.key = key;
        this.id = id;
        this.organizationId = organizationId;
        this.userFirstname = userFirstname;
        this.userAvatarLetter = userFirstname.charAt(0);
        this.organizationAdminFirstname = organizationAdminFirstname;
        this.organizationAdminLastname = organizationAdminLastname;
        this.organizationTitle = ko.observable(organizationTitle);
    }

    on() {
        app.on(constants.messages.organization.titleUpdated, this.organizationTitleUpdated);
        app.on(constants.messages.organization.membershipStarted, this.organizationMembershipStarted);
    }

    off() {
        app.off(constants.messages.organization.titleUpdated, this.organizationTitleUpdated);
        app.off(constants.messages.organization.membershipStarted, this.organizationMembershipStarted);
    }

    organizationTitleUpdated(organizationId, title) {
        if (this.organizationId !== organizationId)
            return;

        this.organizationTitle(title);
    }

    organizationMembershipStarted(organization) {
        if (this.organizationId !== organization.id)
            return;

        app.trigger(constants.notification.messages.remove, this.key);
    }
}