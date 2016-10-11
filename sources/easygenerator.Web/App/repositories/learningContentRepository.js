define(['dataContext', 'http/apiHttpWrapper', 'guard', 'mappers/learningContentModelMapper'],
    function (dataContext, apiHttpWrapper, guard, learningContentModelMapper) {
        "use strict";

        var repository = {
            getCollection: getCollection,

            addLearningContent: addLearningContent,
            removeLearningContent: removeLearningContent,

            updateText: updateText,
            updatePosition: updatePosition
        };

        return repository;

        function getCollection(questionId) {
            return Q.fcall(function () {
                guard.throwIfNotString(questionId, 'Question id is not a string');

                return apiHttpWrapper.post('api/learningContents', { questionId: questionId }).then(function (response) {
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
                throwIfPositionIsInvalid(learningContent.position);

                var data = {
                    questionId: questionId,
                    text: learningContent.text,
                    position: learningContent.position
                };

                return apiHttpWrapper.post('api/learningContent/create', data).then(function (response) {
                    guard.throwIfNotAnObject(response, 'Response is not an object');
                    guard.throwIfNotString(response.Id, 'Learning content id is not a string');
                    guard.throwIfNotString(response.CreatedOn, 'Learning content creation date is not a string');

                    var createdOn = new Date(response.CreatedOn);
                    updateQuestionModifiedOnDate(questionId, createdOn);

                    return learningContentModelMapper.map({
                        Id: response.Id,
                        Text: learningContent.text,
                        Type: learningContent.type,
                        Position: learningContent.position,
                        CreatedOn: createdOn
                    });
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

                return apiHttpWrapper.post('api/learningContent/delete', data).then(function (response) {
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

                return apiHttpWrapper.post('api/learningContent/updateText', data).then(function (response) {
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

        function updatePosition(questionId, learningContentId, position) {
            return Q.fcall(function () {
                guard.throwIfNotString(questionId, 'Question id is not a string');
                guard.throwIfNotString(learningContentId, 'Learning content id is not a string');
                throwIfPositionIsInvalid(position);

                var data = {
                    learningContentId: learningContentId,
                    position: position
                };

                return apiHttpWrapper.post('api/learningContent/updatePosition', data).then(function (response) {
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
            _.each(dataContext.sections, function (section) {
                questions.push.apply(questions, section.questions);
            });
            return questions;
        }

        function getQuestion(questionId) {
            return _.find(getQuestions(), function (item) {
                return item.id == questionId;
            });
        }

        function throwIfPositionIsInvalid(position) {
            guard.throwIfNumberIsOutOfRange(position, -999, 999, 'Learning content position should be number and cannot be less than -999 and more than 999');
        }
    }
);