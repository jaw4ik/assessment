define(['dataContext', 'http/httpWrapper', 'guard', 'mappers/learningContentModelMapper'],
    function (dataContext, httpWrapper, guard, learningContentModelMapper) {
        "use strict";

        var repository = {
            getCollection: getCollection,

            addLearningContent: addLearningContent,
            removeLearningContent: removeLearningContent,

            updateText: updateText
        };

        return repository;

        function getCollection(questionId) {
            return Q.fcall(function () {
                guard.throwIfNotString(questionId, 'Question id is not a string');

                return httpWrapper.post('api/learningContents', { questionId: questionId }).then(function (response) {
                    guard.throwIfNotAnObject(response, 'Response is not an object');
                    guard.throwIfNotArray(response.LearningContents, 'Learning content is not an array');

                    return _.map(response.LearningContents, learningContentModelMapper.map);
                });
            });
        }

        function addLearningContent(questionId, learningContent) {
            return Q.fcall(function () {
                guard.throwIfNotString(questionId, 'Question id is not a string');
                guard.throwIfNotAnObject(learningContent, 'Learning content data is not an object');
                guard.throwIfNotString(learningContent.text, 'Learning content text is not a string');

                var data = {
                    questionId: questionId,
                    text: learningContent.text
                };

                return httpWrapper.post('api/learningContent/create', data).then(function (response) {
                    guard.throwIfNotAnObject(response, 'Response is not an object');
                    guard.throwIfNotString(response.Id, 'Learning content id is not a string');
                    guard.throwIfNotString(response.CreatedOn, 'Learning content creation date is not a string');

                    var createdOn = new Date(response.CreatedOn);
                    updateQuestionModifiedOnDate(questionId, createdOn);

                    return {
                        id: response.Id,
                        createdOn: createdOn
                    };
                });
            });
        }

        function removeLearningContent(questionId, learningContentId) {
            return Q.fcall(function () {

                guard.throwIfNotString(questionId, 'Question id is not a string');
                guard.throwIfNotString(learningContentId, 'Learning content id is not a string');

                var data = {
                    questionId: questionId,
                    learningContentId: learningContentId
                };

                return httpWrapper.post('api/learningContent/delete', data).then(function (response) {
                    guard.throwIfNotAnObject(response, 'Response is not an object');
                    guard.throwIfNotString(response.ModifiedOn, 'Response does not have modification date');

                    var modifiedOn = new Date(response.ModifiedOn);
                    updateQuestionModifiedOnDate(questionId, modifiedOn);

                    return {
                        modifiedOn: modifiedOn
                    };
                });
            });
        }

        function updateText(questionId, learningContentId, text) {
            return Q.fcall(function () {
                guard.throwIfNotString(questionId, 'Question id is not a string');
                guard.throwIfNotString(learningContentId, 'Learning content id is not a string');
                guard.throwIfNotString(text, 'Learning content text is not a string');

                var data = {
                    learningContentId: learningContentId,
                    text: text
                };

                return httpWrapper.post('api/learningContent/updateText', data).then(function (response) {
                    guard.throwIfNotAnObject(response, 'Response is not an object');
                    guard.throwIfNotString(response.ModifiedOn, 'Learning content modification date is not a string');

                    var modifiedOn = new Date(response.ModifiedOn);
                    updateQuestionModifiedOnDate(questionId, modifiedOn);

                    return {
                        modifiedOn: modifiedOn
                    };
                });
            });
        }

        function updateQuestionModifiedOnDate(questionId, modifiedOn) {
            var question = getQuestion(questionId);
            guard.throwIfNotAnObject(question, 'Question does not exist in dataContext');
            question.modifiedOn = modifiedOn;
        }

        function getQuestions() {
            var questions = [];
            _.each(dataContext.objectives, function (objective) {
                questions.push.apply(questions, objective.questions);
            });
            return questions;
        }

        function getQuestion(questionId) {
            return _.find(getQuestions(), function (item) {
                return item.id == questionId;
            });
        }

    }
);