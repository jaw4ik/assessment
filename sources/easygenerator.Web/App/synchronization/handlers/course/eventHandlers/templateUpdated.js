define(['guard', 'durandal/app', 'constants', 'dataContext', 'repositories/templateRepository', 'mappers/templateModelMapper'],
    function (guard, app, constants, dataContext, templateRepository, templateModelMapper) {
        "use strict";

        return function (courseId, courseTemplate, modifiedOn) {
            debugger;
            guard.throwIfNotString(courseId, 'CourseId is not a string');
            guard.throwIfNotString(modifiedOn, 'ModifiedOn is not a string');
            guard.throwIfNotAnObject(courseTemplate, 'Template is not an object');

            var course = _.find(dataContext.courses, function (item) {
                return item.id == courseId;
            });

            guard.throwIfNotAnObject(course, 'Course has not been found');

            var template = templateRepository.addIfNotExists(templateModelMapper.map(courseTemplate));

            guard.throwIfNotAnObject(template, 'Template has not been found');

            course.template = template;
            course.modifiedOn = new Date(modifiedOn);

            app.trigger(constants.messages.course.templateUpdated, course);
        }

    });