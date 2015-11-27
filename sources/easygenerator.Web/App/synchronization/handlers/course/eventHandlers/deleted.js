define(['guard', 'durandal/app', 'constants', 'dataContext'],
    function (guard, app, constants, dataContext) {
        "use strict";

        return function (courseId, deletedObjectiveIds) {
            guard.throwIfNotString(courseId, 'CourseId is not a string');
            guard.throwIfNotArray(deletedObjectiveIds, 'DeletedObjectiveIds is not an array');

            var course = _.find(dataContext.courses, function (item) {
                return item.id == courseId;
            });

            if (_.isNullOrUndefined(course)) {
                return;
            }

            dataContext.courses = _.reject(dataContext.courses, function (item) {
                return item.id === courseId;
            });

            dataContext.objectives = _.reject(dataContext.objectives, function (objective) {
                return _.contains(deletedObjectiveIds, objective.id);
            });

            app.trigger(constants.messages.course.deletedByCollaborator, course.id);
        }
    });