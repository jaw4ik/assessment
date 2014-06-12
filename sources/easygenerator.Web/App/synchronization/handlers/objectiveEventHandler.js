﻿define(['guard', 'durandal/app', 'constants', 'dataContext', 'mappers/questionModelMapper'],
    function (guard, app, constants, dataContext, questionModelMapper) {
        "use strict";

        return {
            objectiveTitleUpdated: objectiiveTitleUpdated,
            questionsReordered: questionsReordered,
            questionCreated: questionCreated
        };

        function getObjective(objectiveId, modifiedOn) {
            var objective = _.find(dataContext.objectives, function (item) {
                return item.id == objectiveId;
            });

            if (!_.isObject(objective)) {
                guard.throwIfNotAnObject(objective, 'Objective has not been found');
            }

            return objective;
        }

        function objectiiveTitleUpdated(objectiveId, title, modifiedOn) {
            guard.throwIfNotString(title, 'Title is not a string');
            guard.throwIfNotString(objectiveId, 'ObjectiveId is not a string');
            guard.throwIfNotString(modifiedOn, 'ModifiedOn is not a string');

            var objective = getObjective(objectiveId, modifiedOn);
            
            objective.title = title;
            objective.modifiedOn = new Date(modifiedOn);

            app.trigger(constants.messages.objective.titleUpdated, objective);
        }

        function questionsReordered(objectiveId, questionIds, modifiedOn) {
            guard.throwIfNotArray(questionIds, 'QuestionIds is not an array');
            guard.throwIfNotString(objectiveId, 'ObjectiveId is not a string');
            guard.throwIfNotString(modifiedOn, 'ModifiedOn is not a string');

            var objective = getObjective(objectiveId, modifiedOn);

            objective.questions = _.map(questionIds, function (id) {
                return _.find(objective.questions, function (question) {
                    return question.id == id;
                });
            });
            objective.modifiedOn = new Date(modifiedOn);

            app.trigger(constants.messages.objective.questionsReordered, objective);
        }

        function questionCreated(objectiveId, question, modifiedOn) {
            guard.throwIfNotString(objectiveId, 'ObjectiveId is not a string');
            guard.throwIfNotAnObject(question, 'Question is not an object');
            guard.throwIfNotString(modifiedOn, 'ModifiedOn is not a string');

            var objective = getObjective(objectiveId, modifiedOn);

            var mappedQuestion = questionModelMapper.map(question);
            objective.questions.push(mappedQuestion);
            objective.modifiedOn = new Date(modifiedOn);

            app.trigger(constants.messages.question.createdByCollaborator, objectiveId, mappedQuestion);
        }
    });