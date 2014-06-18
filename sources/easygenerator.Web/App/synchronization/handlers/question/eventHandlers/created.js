define(['guard', 'durandal/app', 'constants', 'dataContext', 'mappers/questionModelMapper'],
    function (guard, app, constants, dataContext, questionModelMapper) {
        "use strict";

        return function(objectiveId, question, modifiedOn) {
            guard.throwIfNotString(objectiveId, 'ObjectiveId is not a string');
            guard.throwIfNotAnObject(question, 'Question is not an object');
            guard.throwIfNotString(modifiedOn, 'ModifiedOn is not a string');

            var objective = _.find(dataContext.objectives, function (item) {
                return item.id == objectiveId;
            });

            if (!_.isObject(objective)) {
                guard.throwIfNotAnObject(objective, 'Objective has not been found');
            }


            var mappedQuestion = questionModelMapper.map(question);
            objective.questions.push(mappedQuestion);
            objective.modifiedOn = new Date(modifiedOn);

            app.trigger(constants.messages.question.createdByCollaborator, objectiveId, mappedQuestion);
        }
    });