define(['guard', 'durandal/app', 'constants', 'dataContext'],
    function (guard, app, constants, dataContext) {
        "use strict";

        return function (courseId, documentId, success) {
            guard.throwIfNotString(courseId, 'CourseId is not a string');

            var course = _.find(dataContext.courses, function (item) {
                return item.id === courseId;
            });

            guard.throwIfNotAnObject(course, 'Course has not been found');

            if (success) {
                guard.throwIfNotString(documentId, 'DocumentId is not a string');
                course.publishToCoggno.packageUrl = documentId;
            }
            course.saleInfo.isProcessing = false;
            app.trigger(constants.messages.course.publishToCoggno.processed, course, success);
        }

    });