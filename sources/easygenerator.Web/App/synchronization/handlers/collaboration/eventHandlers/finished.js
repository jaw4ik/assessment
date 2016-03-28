define(['guard', 'durandal/app', 'constants', 'dataContext', 'userContext'],
    function (guard, app, constants, dataContext, userContext) {
        "use strict";

        return function (courseId) {
            guard.throwIfNotString(courseId, 'CourseId is not a string');

            var username = _.isObject(userContext.identity) ? userContext.identity.email : '';
          
            dataContext.courses = _.reject(dataContext.courses, function (course) {
                return course.id == courseId;
            });

            dataContext.sections = _.reject(dataContext.sections, function (section) {
                return section.createdBy !== username && !sectionRelatedToAvailableCourses(section.id);
            });

            app.trigger(constants.messages.course.collaboration.finishedByCollaborator, courseId);
        }

        function sectionRelatedToAvailableCourses(sectionId) {
            return _.some(dataContext.courses, function(course) {
                return _.some(course.sections, function(section) {
                    return section.id === sectionId;
                });
            });
        }
    });