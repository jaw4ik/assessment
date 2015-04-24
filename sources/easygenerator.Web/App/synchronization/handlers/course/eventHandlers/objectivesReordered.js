define(['guard', 'durandal/app', 'constants', 'dataContext'],
    function (guard, app, constants, dataContext) {
        "use strict";

        return function (courseId, objectiveIds, modifiedOn) {
            guard.throwIfNotString(courseId, 'CourseId is not a string');
            guard.throwIfNotArray(objectiveIds, 'ObjectiveIds is not an array');
            guard.throwIfNotString(modifiedOn, 'ModifiedOn is not a string');

            var course = _.find(dataContext.courses, function (item) {
                return item.id == courseId;
            });

            guard.throwIfNotAnObject(course, 'Course has not been found');

            course.objectives = _.map(objectiveIds, function (id) {
                return _.find(course.objectives, function (objective) {
                    return objective.id == id;
                });
            });

            course.modifiedOn = new Date(modifiedOn);

            app.trigger(constants.messages.course.objectivesReorderedByCollaborator, course);
        }
    });