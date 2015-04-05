define(['guard', 'durandal/app', 'constants', 'dataContext'],
    function (guard, app, constants, dataContext) {
        "use strict";

        return function (questionId, learningContentsIds, modifiedOn) {
            guard.throwIfNotString(questionId, 'QuestionId is not a string');
            guard.throwIfNotArray(learningContentsIds, 'learningContents is not array');
            guard.throwIfNotString(modifiedOn, 'ModifiedOn is not a string');

            var question = _.find(dataContext.getQuestions(), function (item) {
                return item.id == questionId;
            });

            guard.throwIfNotAnObject(question, 'Question has not been found');
            question.modifiedOn = new Date(modifiedOn);

            app.trigger(constants.messages.question.learningContentsReorderedByCollaborator, question, learningContentsIds);
        }
    });