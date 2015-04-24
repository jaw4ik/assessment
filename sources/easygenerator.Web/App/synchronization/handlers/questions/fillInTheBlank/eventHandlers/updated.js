define(['guard', 'durandal/app', 'constants', 'dataContext'],
    function (guard, app, constants, dataContext) {
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
            question.modifiedOn = new Date(modifiedOn);

            var questionData = {
                content: content,
                answers: _.map(answers, function(answer) {
                    return {
                        text: answer.Text,
                        isCorrect: answer.IsCorrect,
                        groupId: answer.GroupId
                    };
                })
            };

            app.trigger(constants.messages.question.fillInTheBlank.updatedByCollaborator, questionId, questionData);
        }
    });