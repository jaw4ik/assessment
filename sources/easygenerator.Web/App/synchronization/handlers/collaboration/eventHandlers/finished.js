define(['guard', 'durandal/app', 'constants', 'dataContext'],
    function (guard, app, constants, dataContext) {
        "use strict";

        return function (courseId) {
            guard.throwIfNotString(courseId, 'CourseId is not a string');

            dataContext.courses = _.reject(dataContext.courses, function (course) {
                return course.id == courseId;
            });

            dataContext.objectives = _.reject(dataContext.objectives, function (objective) {
                return !_.some(dataContext.courses, function (course) {
                    return _.some(course.objectives, function (courseObjective) {
                        return courseObjective.id === objective.id;
                    });
                });
            });

            app.trigger(constants.messages.course.collaboration.finished, courseId);
        }

    });