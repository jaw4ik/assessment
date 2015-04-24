define(['guard', 'durandal/app', 'constants', 'dataContext', 'mappers/answerModelMapper'],
    function (guard, app, constants, dataContext, answerMapper) {
        "use strict";

        return function (questionId, answerData) {
            guard.throwIfNotString(questionId, 'QuestionId is not a string');
            guard.throwIfNotAnObject(answerData, 'Answer is not an object');

            var question = _.find(dataContext.getQuestions(), function (item) {
                return item.id == questionId;
            });

            guard.throwIfNotAnObject(question, 'Question has not been found');

            question.modifiedOn = new Date(answerData.createdOn);
            var answer = answerMapper.map(answerData);

            app.trigger(constants.messages.question.answer.addedByCollaborator, question, answer);
        }
    });