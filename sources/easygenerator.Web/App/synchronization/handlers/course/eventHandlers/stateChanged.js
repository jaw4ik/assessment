define(['guard', 'durandal/app', 'constants', 'dataContext'],
    function (guard, app, constants, dataContext) {
        "use strict";

        return function (courseId, state) {
            guard.throwIfNotString(courseId, 'CourseId is not a string');
            guard.throwIfNotAnObject(state, 'State is not an object');
            guard.throwIfNotBoolean(state.isDirty, 'State isDirty is not a boolean');

            var course = _.find(dataContext.courses, function (item) {
                return item.id == courseId;
            });

            guard.throwIfNotAnObject(course, 'Course has not been found');

            if (course.isDirty === state.isDirty)
                return;

            course.isDirty = state.isDirty;
            app.trigger(constants.messages.course.stateChanged + courseId, state);
        }

    });