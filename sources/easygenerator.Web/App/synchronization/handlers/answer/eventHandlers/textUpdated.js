define(['guard', 'durandal/app', 'constants', 'dataContext'],
    function (guard, app, constants, dataContext) {
        "use strict";

        return function (questionId, answerId, text, modifiedOn) {
            guard.throwIfNotString(questionId, 'QuestionId is not a string');
            guard.throwIfNotString(text, 'Text is not a string');
            guard.throwIfNotString(answerId, 'AnswerId is not a string');
            guard.throwIfNotString(modifiedOn, 'ModifiedOn is not a string');

            var question = _.find(dataContext.getQuestions(), function (item) {
                return item.id == questionId;
            });

            guard.throwIfNotAnObject(question, 'Question has not been found');

            question.modifiedOn = new Date(modifiedOn);

            app.trigger(constants.messages.question.answer.textUpdatedByCollaborator, question, answerId, text);
        }
    });