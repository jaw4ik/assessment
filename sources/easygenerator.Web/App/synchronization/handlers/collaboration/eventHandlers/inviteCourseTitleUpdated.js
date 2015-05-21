define(['guard', 'durandal/app', 'constants'],
    function (guard, app, constants) {
        "use strict";

        return function (courseId, title) {
            guard.throwIfNotString(courseId, 'CourseId is not a string');
            guard.throwIfNotString(title, 'Title is not a string');

            app.trigger(constants.messages.course.collaboration.inviteCourseTitleUpdated + courseId, title);
        }
    });