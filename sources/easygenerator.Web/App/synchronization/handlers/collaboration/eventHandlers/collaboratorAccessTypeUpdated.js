import app from 'durandal/app';
import guard from 'guard';
import constants from 'constants';
import dataContext from 'dataContext';
import _ from 'underscore';

export default function(courseId, collaboratorId, isAdmin) {
    guard.throwIfNotString(courseId, 'courseId is not a string');
    guard.throwIfNotString(collaboratorId, 'collaboratorId is not a string');
    guard.throwIfNotBoolean(isAdmin, 'isAdmin is not a bool');

    var course = _.find(dataContext.courses, item => {
        return item.id === courseId;
    });

    guard.throwIfNotAnObject(course, 'Course is not an object');

    if (!_.isNullOrUndefined(course.collaborators)) {
        var collaborator = _.find(course.collaborators, item => {
            return item.id === collaboratorId;
        });

        guard.throwIfNotAnObject(collaborator, 'Collaborator is not an object');

        collaborator.isAdmin = true;
        app.trigger(constants.messages.course.collaboration.collaboratorAccessTypeUpdated + collaboratorId, isAdmin);
    }
}