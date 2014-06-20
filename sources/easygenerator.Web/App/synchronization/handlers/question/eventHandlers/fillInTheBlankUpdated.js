define(['guard', 'durandal/app', 'constants', 'dataContext', 'mappers/answerModelMapper'],
    function (guard, app, constants, dataContext, answerModelMapper) {
        "use strict";

        return function (questionId, content, answers, modifiedOn) {
            guard.throwIfNotString(questionId, 'QuestionId is not a string');
            guard.throwIfNotArray(answers, 'Answers is not an array');
            guard.throwIfNotString(modifiedOn, 'ModifiedOn is not a string');

            var question = _.find(dataContext.getQuestions(), function (item) {
                return item.id == questionId;
            });

            guard.throwIfNotAnObject(question, 'Question has not been found');

            question.content = content;
            question.answers = _.map(answers, answerModelMapper.map);
            question.modifiedOn = new Date(modifiedOn);
            app.trigger(constants.messages.question.fillInTheBlank.updatedByCollaborator, question);
        }
    });