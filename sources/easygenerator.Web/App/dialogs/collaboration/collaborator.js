import ko from 'knockout';
import _ from 'underscore';
import constants from 'constants';
import collaboratorRepository from 'repositories/collaboratorRepository';
import app from 'durandal/app';
import userContext from 'userContext';
import router from 'routing/router';
import eventTracker from 'eventTracker';

var events = {
    removeCollaborator: 'Remove collaborator'
};

export default class Collaborator {
    constructor(courseOwner, collaborator) {
        this.id = collaborator.id;
        this.email = collaborator.email;
        this.isOwner = collaborator.email === courseOwner;
        this.isCurrentUser = collaborator.email === userContext.identity.email;
        this.isRegistered = ko.observable(collaborator.registered);
        this.isAccepted = ko.observable(collaborator.isAccepted);
        this.name = ko.observable(_.isNullOrUndefined(collaborator.fullName) || _.isEmptyOrWhitespace(collaborator.fullName) ? collaborator.email : collaborator.fullName);
        this.avatarLetter = ko.computed(() => {
            return this.isRegistered() ? this.name().charAt(0) : '';
        });

        this.canBeRemoved = userContext.identity.email === courseOwner && !this.isOwner;
        this.isRemoving = ko.observable(collaborator.state === constants.collaboratorStates.deleting);
        this.isRemoveConfirmationShown = ko.observable(this.isRemoving());
        this.isRemoveSuccessMessageShown = ko.observable(false);

        this._collaboratorRegisteredProxy = this.collaboratorRegistered.bind(this);
        this._collaborationAcceptedProxy = this.collaborationAccepted.bind(this);

        if (!this.isRegistered()) {
            app.on(constants.messages.course.collaboration.collaboratorRegistered + this.email, this._collaboratorRegisteredProxy);
        }

        if (!this.isAccepted()) {
            app.on(constants.messages.course.collaboration.inviteAccepted + this.id, this._collaborationAcceptedProxy);
        }
    }

    deactivate() {
        if (!this.isRemoving()) {
            this.isRemoveConfirmationShown(false);
        }

        app.off(constants.messages.course.collaboration.collaboratorRegistered + this.email, this._collaboratorRegisteredProxy);
        app.off(constants.messages.course.collaboration.inviteAccepted + this.id, this._collaborationAcceptedProxy);
    }

    showRemoveConfirmation() {
        this.isRemoveConfirmationShown(true);
    }

    hideRemoveConfirmation() {
        this.isRemoveConfirmationShown(false);
    }

    removeCollaborator() {
        eventTracker.publish(events.removeCollaborator);
        var collaborationId = this.id,
            collaboratorEmail = this.email,
            courseId = router.routeData().courseId;

        this.isRemoving(true);
        app.trigger(constants.messages.course.collaboration.deleting.started + collaborationId, collaborationId);

        return collaboratorRepository.remove(courseId, collaboratorEmail)
            .then(collaboration => {
                this.isRemoveSuccessMessageShown(true);
                app.trigger(constants.messages.course.collaboration.deleting.completed + collaborationId, collaboration);
                app.trigger(constants.messages.course.collaboration.collaboratorRemoved + courseId, collaboration.email);
            })
            .fail(errorMessage => {
                this.hideRemoveConfirmation();
                app.trigger(constants.messages.course.collaboration.deleting.failed + collaborationId, errorMessage);
            })
            .fin(() => {
                this.isRemoving(false);
            });
    }

    collaboratorRegistered(userInfo) {
        this.name(userInfo.fullName);
        this.isRegistered(true);

        app.off(constants.messages.course.collaboration.collaboratorRegistered + this.email, this._collaboratorRegisteredProxy);
    }

    collaborationAccepted() {
        this.isAccepted(true);

        app.off(constants.messages.course.collaboration.inviteAccepted + this.id, this._collaborationAcceptedProxy);
    }
};
