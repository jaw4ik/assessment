define(['guard', 'durandal/app', 'constants', 'dataContext'],
    function (guard, app, constants, dataContext) {
        "use strict";

        return function(objectiveId, questionIds, modifiedOn) {
            guard.throwIfNotArray(questionIds, 'QuestionIds is not an array');
            guard.throwIfNotString(objectiveId, 'ObjectiveId is not a string');
            guard.throwIfNotString(modifiedOn, 'ModifiedOn is not a string');

            var objective = _.find(dataContext.objectives, function (item) {
                return item.id == objectiveId;
            });

            if (!_.isObject(objective)) {
                guard.throwIfNotAnObject(objective, 'Objective has not been found');
            }

            objective.questions = _.reject(objective.questions, function (item) {
                return _.indexOf(questionIds, item.id) != -1;
            });

            objective.modifiedOn = new Date(modifiedOn);

            app.trigger(constants.messages.question.deletedByCollaborator, objectiveId, questionIds);
        }
    });