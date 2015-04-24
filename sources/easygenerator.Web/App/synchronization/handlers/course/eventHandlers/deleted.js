define(['guard', 'durandal/app', 'constants', 'dataContext'],
    function (guard, app, constants, dataContext) {
        "use strict";

        return function (courseId) {
            guard.throwIfNotString(courseId, 'CourseId is not a string');

            var course = _.find(dataContext.courses, function (item) {
                return item.id == courseId;
            });

            if (_.isNullOrUndefined(course)) {
                return;
            }

            dataContext.courses = _.reject(dataContext.courses, function (item) {
                return item.id === courseId;
            });

            app.trigger(constants.messages.course.deletedByCollaborator, course.id);
        }
    });