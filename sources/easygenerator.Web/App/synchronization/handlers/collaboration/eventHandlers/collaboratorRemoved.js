define(['guard', 'durandal/app', 'constants', 'dataContext'],
    function (guard, app, constants, dataContext) {
        "use strict";

        return function (courseId, collaboratorEmail) {
            guard.throwIfNotString(courseId, 'courseId is not a string');
            guard.throwIfNotString(collaboratorEmail, 'collaboratorEmail is not a string');

            var course = _.find(dataContext.courses, function (item) {
                return item.id == courseId;
            });

            guard.throwIfNotAnObject(course, 'Course is not an object');

            if (!_.isNullOrUndefined(course.collaborators)) {
                course.collaborators = _.reject(course.collaborators, function (item) {
                    return item.email == collaboratorEmail;
                });
            }

            app.trigger(constants.messages.course.collaboration.collaboratorRemoved + courseId, collaboratorEmail);
        }
    });