define(['guard', 'durandal/app', 'constants', 'dataContext', 'userContext'],
    function (guard, app, constants, dataContext, userContext) {
        "use strict";

        return function (courseId) {
            guard.throwIfNotString(courseId, 'CourseId is not a string');

            var username = _.isObject(userContext.identity) ? userContext.identity.email : '';
          
            dataContext.courses = _.reject(dataContext.courses, function (course) {
                return course.id == courseId;
            });

            dataContext.objectives = _.reject(dataContext.objectives, function (objective) {
                return  objective.createdBy !== username && !objectiveRelatedToAvailableCourses(objective.id);
            });

            app.trigger(constants.messages.course.collaboration.finished, courseId);
        }

        function objectiveRelatedToAvailableCourses(objectiveId) {
            return _.some(dataContext.courses, function(course) {
                return _.some(course.objectives, function(objective) {
                    return objective.id === objectiveId;
                });
            });
        }
    });