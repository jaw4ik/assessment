define(['dataContext', 'http/apiHttpWrapper', 'guard', 'models/answerOption','mappers/answerModelMapper'],
    function (dataContext, apiHttpWrapper, guard, answerModel, answerMapper) {
        "use strict";

        var repository = {
            getCollection: getCollection,

            addAnswer: addAnswer,
            removeAnswer: removeAnswer,
            updateAnswer: updateAnswer,
            updateText: updateText,
            singleSelectTextChangeCorrectAnswer: singleSelectTextChangeCorrectAnswer
        };

        return repository;

        function getCollection(questionId) {
            return Q.fcall(function () {
                guard.throwIfNotString(questionId, 'Question id is not a string');

                return apiHttpWrapper.post('api/answers', { questionId: questionId }).then(function (response) {
                    guard.throwIfNotAnObject(response, 'Response is not an object');
                    guard.throwIfNotArray(response.Answers, 'Answers is not an array');
                    return _.map(response.Answers, function (answer) {
                        return answerMapper.map(answer);
                    });
                });
            });
        }

        function addAnswer(questionId, answer) {
            return Q.fcall(function () {
                guard.throwIfNotString(questionId, 'Question id is not a string');
                guard.throwIfNotAnObject(answer, 'Answer data is not an object');
                guard.throwIfNotString(answer.text, 'Answer data text is not a string');
                guard.throwIfNotBoolean(answer.isCorrect, 'Answer data correctness is not a boolean');

                var data = {
                    questionId: questionId,
                    text: answer.text,
                    isCorrect: answer.isCorrect
                };

                return apiHttpWrapper.post('api/answer/create', data).then(function (response) {
                    guard.throwIfNotAnObject(response, 'Response is not an object');
                    guard.throwIfNotString(response.Id, 'Answer id is not a string');
                    guard.throwIfNotString(response.CreatedOn, 'Answer creation date is not a string');

                    var createdOn = new Date(response.CreatedOn);
                    updateQuestionModifiedOnDate(questionId, createdOn);

                    return {
                        id: response.Id,
                        createdOn: createdOn
                    };
                });
            });
        }

        function removeAnswer(questionId, answerId) {
            return Q.fcall(function () {
                guard.throwIfNotString(questionId, 'Question id is not a string');
                guard.throwIfNotString(answerId, 'Answer id is not a string');

                var data = {
                    questionId: questionId,
                    answerId: answerId
                };

                return apiHttpWrapper.post('api/answer/delete', data).then(function (response) {
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

        function updateAnswer(questionId, answerId, text, isCorrect) {
            return Q.fcall(function () {
                guard.throwIfNotString(questionId, 'Question id is not a string');
                guard.throwIfNotString(answerId, 'Answer id is not a string');
                guard.throwIfNotString(text, 'Answer text is not a string');
                guard.throwIfNotBoolean(isCorrect, 'Answer correctness is not a boolean');

                var data = {
                    answerId: answerId,
                    text: text,
                    isCorrect: isCorrect
                };

                return apiHttpWrapper.post('api/answer/update', data).then(function (response) {
                    guard.throwIfNotAnObject(response, 'Response is not an object');
                    guard.throwIfNotString(response.ModifiedOn, 'Answer modification date is not a string');

                    var modifiedOn = new Date(response.ModifiedOn);
                    updateQuestionModifiedOnDate(questionId, modifiedOn);

                    return {
                        modifiedOn: modifiedOn
                    };
                });
            });
        }

        function updateText(questionId, answerId, text) {
            return Q.fcall(function() {
                guard.throwIfNotString(questionId, 'Question id is not a string');
                guard.throwIfNotString(answerId, 'Answer id is not a string');
                guard.throwIfNotString(text, 'Answer text is not a string');

                var data = {
                    answerId: answerId,
                    text: text
                };

                return apiHttpWrapper.post('api/answer/updatetext', data).then(function (response) {
                    guard.throwIfNotAnObject(response, 'Response is not an object');
                    guard.throwIfNotString(response.ModifiedOn, 'Answer modification date is not a string');

                    var modifiedOn = new Date(response.ModifiedOn);
                    updateQuestionModifiedOnDate(questionId, modifiedOn);

                    return {
                        modifiedOn: modifiedOn
                    };
                });
            });
        }

        function singleSelectTextChangeCorrectAnswer(questionId, answerId) {
            return Q.fcall(function() {
                guard.throwIfNotString(questionId, 'Question id is not a string');
                guard.throwIfNotString(answerId, 'Answer id is not a string');

                var data = {
                    questionId: questionId,
                    answerId: answerId
                };

                return apiHttpWrapper.post('api/answer/singleselecttext/changecorrectanswer', data).then(function (response) {
                    guard.throwIfNotAnObject(response, 'Response is not an object');
                    guard.throwIfNotString(response.ModifiedOn, 'Answer modification date is not a string');

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
    }
);