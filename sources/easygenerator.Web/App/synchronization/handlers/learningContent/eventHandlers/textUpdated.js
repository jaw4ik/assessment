define(['guard', 'durandal/app', 'constants', 'dataContext', 'mappers/learningContentModelMapper'],
    function (guard, app, constants, dataContext, learningContentModelMapper) {
        "use strict";

        return function(questionId, learningContent, modifiedOn) {
            guard.throwIfNotString(questionId, 'QuestionId is not a string');
            guard.throwIfNotAnObject(learningContent, 'LearningContent is not an object');
            guard.throwIfNotString(modifiedOn, 'ModifiedOn is not a string');

            var question = _.find(dataContext.getQuestions(), function(item) {
                return item.id == questionId;
            });

            guard.throwIfNotAnObject(question, 'Question has not been found');
            question.modifiedOn = new Date(modifiedOn);

            app.trigger(constants.messages.question.learningContent.textUpdatedByCollaborator, question, learningContentModelMapper.map(learningContent));
        };
    }
);