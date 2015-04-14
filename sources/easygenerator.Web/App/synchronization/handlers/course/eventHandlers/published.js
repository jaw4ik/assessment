define(['guard', 'durandal/app', 'constants', 'dataContext'],
    function (guard, app, constants, dataContext) {
        "use strict";

        return function (courseId, publicationUrl) {
            guard.throwIfNotString(courseId, 'CourseId is not a string');
            guard.throwIfNotString(publicationUrl, 'PublicationUrl is not a string');

            var course = _.find(dataContext.courses, function (item) {
                return item.id == courseId;
            });

            guard.throwIfNotAnObject(course, 'Course has not been found');

            course.publish.packageUrl = publicationUrl;
            app.trigger(constants.messages.course.publish.completed, course);
        }

    });