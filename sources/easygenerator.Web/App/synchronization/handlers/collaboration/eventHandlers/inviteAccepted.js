define(['guard', 'durandal/app', 'constants', 'dataContext'],
    function (guard, app, constants, dataContext) {
        "use strict";

        return function (courseId, collaboratorEmail) {
            guard.throwIfNotString(courseId, 'CourseId is not a string');
            guard.throwIfNotString(collaboratorEmail, 'CollaboratorEmail is not a string');

            var course = _.find(dataContext.courses, function (item) {
                return item.id == courseId;
            });

            guard.throwIfNotAnObject(course, 'Course is not an object');

            if (!_.isNullOrUndefined(course.collaborators)) {
                var collaborator = _.find(course.collaborators, function (item) {
                    return item.email == collaboratorEmail;
                });

                guard.throwIfNotAnObject(collaborator, 'Collaborator is not an object');

                collaborator.isAccepted = true;
                app.trigger(constants.messages.course.collaboration.inviteAccepted + collaborator.id);
            }
        }
    });