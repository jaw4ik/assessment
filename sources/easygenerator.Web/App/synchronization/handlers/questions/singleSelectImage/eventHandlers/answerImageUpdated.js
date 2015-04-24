define(['guard', 'durandal/app', 'constants', 'dataContext', 'mappers/singleSelectImageAnswerMapper'],
    function (guard, app, constants, dataContext, mapper) {
        "use strict";

        return function (questionId, answer, modifiedOn) {
            guard.throwIfNotString(questionId, 'QuestionId is not a string');
            guard.throwIfNotAnObject(answer, 'Answer is not an object');
            guard.throwIfNotString(modifiedOn, 'ModifiedOn is not a string');

            var question = _.find(dataContext.getQuestions(), function (item) {
                return item.id == questionId;});

            guard.throwIfNotAnObject(question, 'Question has not been found');
            question.modifiedOn = new Date(modifiedOn);

            app.trigger(constants.messages.question.singleSelectImage.answerImageUpdatedByCollaborator, questionId, mapper.map(answer));
        }
    });