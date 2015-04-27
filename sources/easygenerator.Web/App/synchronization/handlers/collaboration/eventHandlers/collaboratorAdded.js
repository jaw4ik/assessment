define(['guard', 'durandal/app', 'constants', 'dataContext', 'mappers/courseModelMapper', 'mappers/collaboratorModelMapper'],
    function (guard, app, constants, dataContext, courseModelMapper, collaboratorModelMapper) {
        "use strict";

        return function (courseId, user) {
            guard.throwIfNotString(courseId, 'courseId is not a string');
            guard.throwIfNotAnObject(user, 'User is not an object');

            var collaborator = collaboratorModelMapper.map(user);

            var course = _.find(dataContext.courses, function (item) {
                return item.id == courseId;
            });

            guard.throwIfNotAnObject(course, 'Course is not an object');

            if (!_.isNullOrUndefined(course.collaborators)) {
                course.collaborators.push(collaborator);
            }

            app.trigger(constants.messages.course.collaboration.collaboratorAdded + courseId, collaborator);
        }
    });