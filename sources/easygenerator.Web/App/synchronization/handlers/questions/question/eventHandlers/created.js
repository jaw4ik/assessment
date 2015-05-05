define(['guard', 'durandal/app', 'constants', 'dataContext', 'mappers/questionModelMapper'],
    function (guard, app, constants, dataContext, questionModelMapper) {
        "use strict";

        return function (objectiveId, newQuestion, modifiedOn) {
            guard.throwIfNotString(objectiveId, 'ObjectiveId is not a string');
            guard.throwIfNotAnObject(newQuestion, 'Question is not an object');
            guard.throwIfNotString(modifiedOn, 'ModifiedOn is not a string');

            var objective = _.find(dataContext.objectives, function (item) {
                return item.id == objectiveId;
            });

            if (!_.isObject(objective)) {
                guard.throwIfNotAnObject(objective, 'Objective has not been found');
            }

            var question = _.find(objective.questions, function(item) {
                return item.id == newQuestion.Id;
            });

            if (!_.isNullOrUndefined(question))
                return;

            var mappedQuestion = questionModelMapper.map(newQuestion);
            objective.questions.push(mappedQuestion);
            objective.modifiedOn = new Date(modifiedOn);

            app.trigger(constants.messages.question.createdByCollaborator, objectiveId, mappedQuestion);
        }
    });