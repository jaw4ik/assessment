define(['guard', 'durandal/app', 'constants', 'dataContext'],
    function (guard, app, constants, dataContext) {
        "use strict";

        return function(courseId, templateId, modifiedOn) {
            guard.throwIfNotString(courseId, 'CourseId is not a string');
            guard.throwIfNotString(templateId, 'TemplateId content is not a string');
            guard.throwIfNotString(modifiedOn, 'ModifiedOn is not a string');

            var course = _.find(dataContext.courses, function (item) {
                return item.id == courseId;
            });

            guard.throwIfNotAnObject(course, 'Course has not been found');

            var template = _.find(dataContext.templates, function (item) {
                return item.id === templateId;
            });

            guard.throwIfNotAnObject(template, 'Template has not been found');

            course.template = template;
            course.modifiedOn = new Date(modifiedOn);

            app.trigger(constants.messages.course.templateUpdated, course);
        }

    });