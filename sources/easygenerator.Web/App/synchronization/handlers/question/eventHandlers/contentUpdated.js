﻿define(['guard', 'durandal/app', 'constants', 'dataContext'],
    function (guard, app, constants, dataContext) {
        "use strict";

        return function (questionId, content, modifiedOn) {
            guard.throwIfNotString(questionId, 'QuestionId is not a string');
            guard.throwIfNotString(content, 'Content is not a string');
            guard.throwIfNotString(modifiedOn, 'ModifiedOn is not a string');

            var question = _.find(dataContext.getQuestions(), function (item) {
                return item.id == questionId;
            });

            guard.throwIfNotAnObject(question, 'Question has not been found');

            question.content = content;
            question.modifiedOn = new Date(modifiedOn);

            app.trigger(constants.messages.question.contentUpdatedByCollaborator, question);
        }
    });