define(['guard', 'durandal/app', 'constants', 'dataContext'],
    function (guard, app, constants, dataContext) {
        "use strict";

        return function (courseId, introductionContent, modifiedOn) {
            guard.throwIfNotString(courseId, 'CourseId is not a string');
            guard.throwIfNotString(modifiedOn, 'ModifiedOn is not a string');

            var course = _.find(dataContext.courses, function (item) {
                return item.id == courseId;
            });

            guard.throwIfNotAnObject(course, 'Course has not been found');

            course.introductionContent = introductionContent;
            course.modifiedOn = new Date(modifiedOn);

            app.trigger(constants.messages.course.introductionContentUpdatedByCollaborator, course);
        }

    });