define(['guard', 'durandal/app', 'constants', 'dataContext', 'mappers/courseModelMapper', 'mappers/objectiveModelMapper', 'repositories/templateRepository', 'mappers/templateModelMapper'],
    function (guard, app, constants, dataContext, courseModelMapper, objectiveModelMapper, templateRepository, templateModelMapper) {
        "use strict";

        return function (course, objectives, courseTemplate) {
            guard.throwIfNotAnObject(course, 'Course is not an object');
            guard.throwIfNotArray(objectives, 'Objectives is not an array');
            guard.throwIfNotAnObject(courseTemplate, 'Template is not an object');

            _.each(objectives, function (objective) {
                var objectiveExists = _.some(dataContext.objectives, function (obj) {
                    return obj.id === objective.Id;
                });

                if (!objectiveExists) {
                    dataContext.objectives.push(objectiveModelMapper.map(objective));
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
                existingCourse = courseModelMapper.map(course, dataContext.objectives, dataContext.templates);
                dataContext.courses.push(existingCourse);
            }

            app.trigger(constants.messages.course.collaboration.started, existingCourse);
        }

    });