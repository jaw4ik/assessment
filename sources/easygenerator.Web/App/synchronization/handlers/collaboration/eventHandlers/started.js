define(['guard', 'durandal/app', 'constants', 'dataContext', 'mappers/courseModelMapper', 'mappers/sectionModelMapper', 'repositories/templateRepository', 'mappers/templateModelMapper'],
    function (guard, app, constants, dataContext, courseModelMapper, sectionModelMapper, templateRepository, templateModelMapper) {
        "use strict";

        return function (course, sections, courseTemplate) {
            guard.throwIfNotAnObject(course, 'Course is not an object');
            guard.throwIfNotArray(sections, 'Sections is not an array');
            guard.throwIfNotAnObject(courseTemplate, 'Template is not an object');

            _.each(sections, function (section) {
                var sectionExists = _.some(dataContext.sections, function (obj) {
                    return obj.id === section.Id;
                });

                if (!sectionExists) {
                    dataContext.sections.push(sectionModelMapper.map(section));
                }
            });

            var existingCourse = _.find(dataContext.courses, function (item) {
                return item.id == course.Id;
            });

            var template = _.find(dataContext.templates, function (item) {
                return item.id == courseTemplate.Id;
            });

            if (_.isNullOrUndefined(template)) {
                templateRepository.add(templateModelMapper.map(courseTemplate));
            }

            if (_.isNullOrUndefined(existingCourse)) {
                existingCourse = courseModelMapper.map(course, dataContext.sections, dataContext.templates);
                dataContext.courses.push(existingCourse);
            }

            app.trigger(constants.messages.course.collaboration.started, existingCourse);
        }

    });