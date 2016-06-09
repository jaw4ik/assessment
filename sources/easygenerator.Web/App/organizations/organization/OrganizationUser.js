import ko from 'knockout';
import _ from 'underscore';
import userContext from 'userContext';
import constants from 'constants';
import app from 'durandal/app';

export default class OrganizationUser {
    constructor(user) {
        let self = this;
        this.id = user.id;
        this.email = user.email;
        this.isAdmin = user.isAdmin;
        this.createdOn = user.createdOn;
        this.status = ko.observable(user.status);
        this.isRegistered = ko.observable(user.isRegistered);
        this.fullName = ko.observable(user.fullName);

        this.isReinviting = ko.observable(false);

        this.isWaitingForAcceptance = ko.computed(() => {
            return self.status() === constants.organizationUserStatus.waitingForAcceptance;
        });
        this.isDeclined = ko.computed(() => {
            return self.status() === constants.organizationUserStatus.declined;
        });

        this.name = ko.computed(() => {
            return self.isRegistered() ? self.fullName() : self.email;
        });
        this.avatarLetter = ko.computed(() => {
            return self.name() && self.name().length > 0 ? self.name().charAt(0) : '';
        });
        this.isActivated = ko.computed(() => {
            return self.isRegistered() && self.status() === constants.organizationUserStatus.accepted;
        });
        this.canBeRemoved = this.email !== userContext.identity.email;

        this._userRegisteredProxy = this.userRegistered.bind(this);
        this._userStatusUpdatedProxy = this.userStatusUpdated.bind(this);

        if (!this.isRegistered()) {
            app.on(constants.messages.organization.userRegistered + this.email, this._userRegisteredProxy);
        }

        app.on(constants.messages.organization.userStatusUpdated + this.id, this._userStatusUpdatedProxy);
    }

    deactivate() {
        if (!this.isRegistered()) {
            app.off(constants.messages.organization.userRegistered + this.email, this._userRegisteredProxy);
        }

        app.off(constants.messages.organization.userStatusUpdated + this.id, this._userStatusUpdatedProxy);
    }

    userRegistered(userData) {
        this.fullName(userData.fullName);
        this.isRegistered(true);
        app.off(constants.messages.organization.userRegistered + this.email, this._userRegisteredProxy);
    }

    userStatusUpdated(status) {
        this.status(status);
    }
};
