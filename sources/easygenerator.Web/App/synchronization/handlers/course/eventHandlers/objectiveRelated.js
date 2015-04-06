define(['guard', 'durandal/app', 'constants', 'dataContext', 'mappers/objectiveModelMapper'],
    function (guard, app, constants, dataContext, objectiveModelMapper) {
        "use strict";

        return function(courseId, objectiveData, targetIndex, modifiedOn) {
            guard.throwIfNotString(courseId, 'CourseId is not a string');
            guard.throwIfNotAnObject(objectiveData, 'Objective is not an object');
            guard.throwIfNotString(modifiedOn, 'ModifiedOn is not a string');

            var course = _.find(dataContext.courses, function(item) {
                return item.id == courseId;
            });

            guard.throwIfNotAnObject(course, 'Course has not been found');

            var objective = objectiveModelMapper.map(objectiveData);
            var objectiveExists = _.some(dataContext.objectives, function(item) {
                return item.id === objective.id;
            });

            if (!objectiveExists) {
                dataContext.objectives.push(objective);
            }

            course.objectives = _.reject(course.objectives, function(item) {
                return item.id == objective.id;
            });

            if (!_.isNullOrUndefined(targetIndex)) {
                course.objectives.splice(targetIndex, 0, objective);
            } else {
                course.objectives.push(objective);
            }

            course.modifiedOn = new Date(modifiedOn);

            app.trigger(constants.messages.course.objectiveRelatedByCollaborator, courseId, objective, targetIndex);
        };

    });