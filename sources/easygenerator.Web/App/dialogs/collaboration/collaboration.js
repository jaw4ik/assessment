import ko from 'knockout';
import _ from 'underscore';
import addCollaboratorViewModel from 'dialogs/collaboration/addCollaborator';
import stopCollaborationViewModel from 'dialogs/collaboration/stopCollaboration';
import constants from 'constants';
import repository from 'repositories/collaboratorRepository';
import app from 'durandal/app';
import userContext from 'userContext';
import Collaborator from 'dialogs/collaboration/collaborator';
import guard from 'guard';
import courseRepository from 'repositories/courseRepository';

class Collaboration{
    constructor() {
        this.isShown = ko.observable(false);
        this.collaborationWarning = ko.observable('');
        this.courseId = '';
        this.courseOwner = '';
        this._collaboratorAddedProxy = this.collaboratorAdded.bind(this);
        this._collaboratorRemovedProxy = this.collaboratorRemoved.bind(this);
        this.addCollaboratorViewModel = addCollaboratorViewModel;
        this.stopCollaborationViewModel = stopCollaborationViewModel;
        this.isLoadingCollaborators = ko.observable(false);
        this.collaborators = ko.observableArray([]);
        this.isUserCourseOwner = ko.observable(false);
        this.canStopCollaboration = ko.observable(false);

        this.stopCollaborationViewModel.init(this.hide.bind(this));
    }

    async show(courseId, courseOwner) {
        guard.throwIfNotString(courseId, 'courseId is not a string');
        guard.throwIfNotString(courseOwner, 'courseOwner is not a string');

        this.reset();
        this.courseOwner = courseOwner;
        this.isUserCourseOwner(userContext.identity.email === courseOwner);
        this.addCollaboratorViewModel.isEnabled(false);
        this.isLoadingCollaborators(true);

        this.isShown(true);

        this.courseId = courseId;
        app.on(constants.messages.course.collaboration.collaboratorAdded + this.courseId, this._collaboratorAddedProxy);
        app.on(constants.messages.course.collaboration.collaboratorRemoved + this.courseId, this._collaboratorRemovedProxy);

        var course = await courseRepository.getById(this.courseId);
        this.canStopCollaboration(course.ownership === constants.courseOwnership.shared);

        var collaborators = await repository.getCollection(this.courseId);
        var collaboratorsList = _.chain(collaborators)
            .map(function(item) {
                return new Collaborator(courseOwner, item);
            })
            .value();

        this.collaborators(this.sortCollaborators(collaboratorsList));

        this.isLoadingCollaborators(false);
        this.addCollaboratorViewModel.isEnabled(true);
    }

    hide() {
        app.off(constants.messages.course.collaboration.collaboratorAdded + this.courseId, this._collaboratorAddedProxy);
        app.off(constants.messages.course.collaboration.collaboratorRemoved + this.courseId, this._collaboratorRemovedProxy);

        _.each(this.collaborators(), function(item) {
            item.deactivate();
        });

        this.isShown(false);
    }

    collaboratorAdded(collaborator) {
        var items = this.collaborators();
        items.push(new Collaborator(this.courseOwner, collaborator));

        this.collaborators(this.sortCollaborators(items));
    }

    collaboratorRemoved(collaboratorEmail) {
        this.collaborators(_.reject(this.collaborators(), function(item) {
            return item.email === collaboratorEmail;
        }));
    }

    reset() {
        this.stopCollaborationViewModel.reset();
        this.addCollaboratorViewModel.reset();
    }

    sortCollaborators(collaborators) {
        let owner = _.find(collaborators, item => item.isOwner);
        let currentUser = _.find(collaborators, item => item.isCurrentUser && !item.isOwner);

        let items = _.chain(collaborators)
            .without(owner, currentUser)
            .sortBy(collaborators, function(item) {
                return item.createdOn;
            })
            .value();

        if (currentUser) {
            items.unshift(currentUser);
        }
        if (owner){
            items.unshift(owner);
        }

        return items;
    }
}

export default new Collaboration();