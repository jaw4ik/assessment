define(['guard', 'durandal/app', 'constants', 'dataContext'],
    function (guard, app, constants, dataContext) {
        "use strict";

        return function (questionId, dropspot, modifiedOn) {
            guard.throwIfNotString(questionId, 'QuestionId is not a string');
            guard.throwIfNotAnObject(dropspot, 'Dropspot is not an object');
            guard.throwIfNotString(modifiedOn, 'ModifiedOn is not a string');

            var question = _.find(dataContext.getQuestions(), function (item) {
                return item.id == questionId;
            });

            guard.throwIfNotAnObject(question, 'Question has not been found');
            question.modifiedOn = new Date(modifiedOn);

            app.trigger(constants.messages.question.dragAndDropText.dropspotTextChangedByCollaborator, questionId, dropspot.Id, dropspot.Text);
        }
    });