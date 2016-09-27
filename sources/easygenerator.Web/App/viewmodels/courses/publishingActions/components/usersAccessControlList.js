import ko from 'knockout';
import _ from 'underscore';
import notify from 'notify';
import binder from 'binder';
import app from 'durandal/app';
import constants from 'constants';
import eventTracker from 'eventTracker';
import repository from 'repositories/courseRepository';
import addPeopleDialog from 'dialogs/course/addPeople/addPeople';
import localizationManager from 'localization/localizationManager';

const WILDCARD_IDENTITY = '*';

const events = {
    enableWhiteList: 'Enable "whilelist" for the course',
    disableWhiteList: 'Disable "whilelist" for the course'
};

class AccessControlListEntry {
    constructor(courseId, userIdentity, userInvited, removedCallback, removeConfirmationShowedCallback) {
        binder.bindClass(this);

        this.courseId = courseId;
        this.userIdentity = userIdentity;
        this.userInvited = ko.observable(userInvited);
        this.invitationSending = ko.observable(false);
        this.removeConfirmationVisible = ko.observable(false);
        this.removedCallback = removedCallback;
        this.removeConfirmationShowedCallback = removeConfirmationShowedCallback;
    }
    async sendInvitation() {
        this.invitationSending(true);
        try {
            await repository.grantAccess(this.courseId, this.userIdentity, true);
            this.userInvited(true);
        } catch (e) {
            notify.error(localizationManager.localize('responseFailed'));
            throw e;
        } finally {
            this.invitationSending(false);
        }
    }
    showRemoveConfirmation() {
        this.removeConfirmationVisible(true);
        if (_.isFunction(this.removeConfirmationShowedCallback)) {
            this.removeConfirmationShowedCallback(this);
        }
    }
    async remove() {
        try {
            await repository.removeAccess(this.courseId, this.userIdentity);
            if (_.isFunction(this.removedCallback)) {
                this.removedCallback(this);
            }
        } catch (e) {
            notify.error(localizationManager.localize('responseFailed'));
            throw e;
        }
    }
    cancelRemove() {
        this.removeConfirmationVisible(false);
    }
}

export default class {
    constructor() {
        binder.bindClass(this);

        this.courseId = null;
        this.enabled = ko.observable(false);
        this.usersList = ko.observableArray([]);
        this.usersListEmpty = ko.computed(() => this.usersList().length === 0);
        this.showUserAccessControlList = ko.computed(() => this.enabled() || !this.usersListEmpty());
        this.dialogShown = ko.observable(false);
        this.active = ko.computed(() => this.enabled() && this.usersListEmpty());

        addPeopleDialog.on(constants.messages.course.peopleAdded, this.peopleAdded);
        addPeopleDialog.on(constants.dialogs.dialogClosed, this.dialogClosed);

        app.on(constants.messages.course.accessGranted, this.courseAccessGranted);
        app.on(constants.messages.course.accessRemoved, this.courseAccessRemoved);
        app.on(constants.messages.course.invitationSended, this.courseInvitationSended);
    }

    async activate(courseId) {
        this.dialogShown(false);
        this.courseId = courseId;
        let course = await repository.getById(courseId);

        this.enabled(_.some(course.publicationAccessControlList, item => item.userIdentity === WILDCARD_IDENTITY));
        this.usersList(_.chain(course.publicationAccessControlList)
            .reject(item => item.userIdentity === WILDCARD_IDENTITY)
            .map(item => new AccessControlListEntry(this.courseId, item.userIdentity, item.userInvited, this.userRemoved, this.removeConfirmationShowed))
            .value());
    }

    addPeople() {
        if (this.dialogShown()) {
            addPeopleDialog.hide();
            return;
        }

        this.dialogShown(true);
        addPeopleDialog.show(this.courseId);
    }

    peopleAdded(userIdentities, usersInvited) {
        _.each(userIdentities, userIdentity => {
            let entry = _.find(this.usersList(), user => user.userIdentity === userIdentity);
            if (!entry) {
                this.usersList.unshift(new AccessControlListEntry(this.courseId, userIdentity, usersInvited, this.userRemoved, this.removeConfirmationShowed));
            } else if (usersInvited) {
                entry.userInvited(usersInvited);
            }
        });
    }

    removeConfirmationShowed(currentUser) {
        _.each(this.usersList(), user => {
            if (user !== currentUser) {
                user.removeConfirmationVisible(false);
            }
        });
    }

    userRemoved(user) {
        this.usersList.remove(user);
    }

    async enabledModeChanged(newValue) {
        try {
            if (newValue) {
                eventTracker.publish(events.enableWhiteList);
                await repository.grantAccess(this.courseId, WILDCARD_IDENTITY);
            } else {
                eventTracker.publish(events.disableWhiteList);
                await repository.removeAccess(this.courseId, WILDCARD_IDENTITY);
            }
        } catch (e) {
            notify.error(localizationManager.localize('responseFailed'));
            throw e;
        }
    }

    dialogClosed() {
        this.dialogShown(false);
    }

    //#region App-wide events

    courseAccessGranted(courseId, userIdentities, withInvitation) {
        if (this.courseId !== courseId) {
            return;
        }

        if (userIdentities[0] === WILDCARD_IDENTITY) {
            this.enabled(true);
            return;
        }

        this.peopleAdded(userIdentities, withInvitation);
    }

    courseAccessRemoved(courseId, userIdentity) {
        if (this.courseId !== courseId) {
            return;
        }

        if (userIdentity === WILDCARD_IDENTITY) {
            this.enabled(false);
            return;
        }

        let userToRemove = _.find(this.usersList(), user => user.userIdentity === userIdentity);
        if (userToRemove) {
            this.userRemoved(userToRemove);
        }
    }

    courseInvitationSended(courseId, userIdentity) {
        if (this.courseId !== courseId) {
            return;
        }

        let entry = _.find(this.usersList(), user => user.userIdentity === userIdentity);
        if (entry) {
            entry.userInvited(true);
        }
    }

    //#endregion
}
