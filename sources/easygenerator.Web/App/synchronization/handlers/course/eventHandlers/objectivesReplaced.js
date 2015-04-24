define(['guard', 'durandal/app', 'constants', 'dataContext', 'mappers/objectiveModelMapper'],
    function (guard, app, constants, dataContext, objectiveModelMapper) {
        "use strict";

        return function objectivesReplaced(courseId, replacedObjectivesInfo, modifiedOn) {
            guard.throwIfNotString(courseId, 'CourseId is not a string');
            guard.throwIfNotAnObject(replacedObjectivesInfo, 'ReplacedObjectivesInfo is not an object');
            guard.throwIfNotString(modifiedOn, 'ModifiedOn is not a string');

            var course = _.find(dataContext.courses, function (item) {
                return item.id == courseId;
            });

            guard.throwIfNotAnObject(course, 'Course has not been found');
            
            var replacedObjectives = [];
            var clonedObjective;
            var i;
            if (course.objectives) {
                for (i = 0; i < course.objectives.length; i++) {
                    var objectiveId = course.objectives[i].id;
                    if (replacedObjectivesInfo[objectiveId]) {
                        clonedObjective = objectiveModelMapper.map(replacedObjectivesInfo[objectiveId]);
                        course.objectives[i] = clonedObjective;
                        replacedObjectives.push({ oldId: objectiveId, newObjective: clonedObjective });
                        app.trigger(constants.messages.course.objectiveRelatedByCollaborator, courseId, clonedObjective, i);
                    }
                }

                for (i = 0; i < dataContext.objectives.length; i++) {
                    clonedObjective = _.find(replacedObjectives, function (replacedObjective) {
                        return replacedObjective.oldId == dataContext.objectives[i].id;
                    });
                    if (clonedObjective) {
                        dataContext.objectives[i] = clonedObjective.newObjective;
                    }
                }
            }
            
            course.modifiedOn = new Date(modifiedOn);
            app.trigger(constants.messages.course.objectivesUnrelatedByCollaborator, courseId, _.map(replacedObjectives, function (relatedObjective) { return relatedObjective.oldId; }));
        }
    });