define(['guard', 'durandal/app', 'constants'],
    function (guard, app, constants) {
        "use strict";

        return function (courseId) {
            guard.throwIfNotString(courseId, 'CourseId is not a string');

            app.trigger(constants.messages.course.collaboration.inviteRemoved, courseId);
        }
    });