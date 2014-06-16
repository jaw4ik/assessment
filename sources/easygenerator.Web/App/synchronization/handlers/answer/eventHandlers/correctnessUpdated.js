﻿define(['guard', 'durandal/app', 'constants', 'dataContext'],
    function (guard, app, constants, dataContext) {
        "use strict";

        return function (questionId, answerId, isCorrect, modifiedOn) {
            guard.throwIfNotString(questionId, 'QuestionId is not a string');
            guard.throwIfNotString(answerId, 'AnswerId is not a string');
            guard.throwIfNotBoolean(isCorrect, 'IsCorrect is not boolean');
            guard.throwIfNotString(modifiedOn, 'ModifiedOn is not a string');

            var question = _.find(dataContext.getQuestions(), function (item) {
                return item.id == questionId;
            });

            guard.throwIfNotAnObject(question, 'Question has not been found');

            question.modifiedOn = new Date(modifiedOn);

            app.trigger(constants.messages.question.answer.correctnessUpdatedByCollaborator, questionId, answerId, isCorrect);
        }
    });