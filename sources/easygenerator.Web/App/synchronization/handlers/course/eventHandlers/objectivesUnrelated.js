﻿define(['guard', 'durandal/app', 'constants', 'dataContext'],
    function (guard, app, constants, dataContext) {
        "use strict";

        return function objectivesUnrelated(courseId, objectiveIds, modifiedOn) {
            guard.throwIfNotString(courseId, 'CourseId is not a string');
            guard.throwIfNotArray(objectiveIds, 'ObjectiveIds is not an array');
            guard.throwIfNotString(modifiedOn, 'ModifiedOn is not a string');

            var course = _.find(dataContext.courses, function (item) {
                return item.id == courseId;
            });

            guard.throwIfNotAnObject(course, 'Course has not been found');

            var unrelatedObjectives = _.filter(course.objectives, function (item) {
                return _.some(objectiveIds, function (id) {
                    return item.id == id;
                });
            });

            unrelatedObjectives = _.map(unrelatedObjectives, function (item) {
                return item.id;
            });

            course.objectives = _.reject(course.objectives, function (objective) {
                return _.some(objectiveIds, function (item) {
                    return item == objective.id;
                });
            });

            course.modifiedOn = new Date(modifiedOn);

            app.trigger(constants.messages.course.objectivesUnrelated, course.id, unrelatedObjectives);
        }

    });