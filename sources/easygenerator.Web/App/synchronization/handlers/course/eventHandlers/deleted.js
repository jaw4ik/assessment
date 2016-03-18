define(['guard', 'durandal/app', 'constants', 'dataContext'],
    function (guard, app, constants, dataContext) {
        "use strict";

        return function (courseId, deletedSectionIds) {
            guard.throwIfNotString(courseId, 'CourseId is not a string');
            guard.throwIfNotArray(deletedSectionIds, 'DeletedSectionIds is not an array');

            var course = _.find(dataContext.courses, function (item) {
                return item.id == courseId;
            });

            if (_.isNullOrUndefined(course)) {
                return;
            }

            dataContext.courses = _.reject(dataContext.courses, function (item) {
                return item.id === courseId;
            });

            dataContext.sections = _.reject(dataContext.sections, function (section) {
                return _.contains(deletedSectionIds, section.id);
            });

            app.trigger(constants.messages.course.deletedByCollaborator, course.id);
        }
    });