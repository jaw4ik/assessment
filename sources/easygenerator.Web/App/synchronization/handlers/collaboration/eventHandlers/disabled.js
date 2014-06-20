define(['guard', 'durandal/app', 'constants', 'dataContext'],
    function (guard, app, constants, dataContext) {
        "use strict";

        return function (courseIds) {
            guard.throwIfNotArray(courseIds, 'courseIds is not an array');

            dataContext.courses = _.reject(dataContext.courses, function (item) {
                return _.some(courseIds, function (courseId) {
                    return item.id == courseId;
                });
            });

            app.trigger(constants.messages.course.collaboration.disabled, courseIds);
        }

    });