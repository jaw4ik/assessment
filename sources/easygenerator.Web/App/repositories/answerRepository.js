define(['dataContext', 'httpWrapper', 'guard', 'models/answerOption'],
    function (dataContext, httpWrapper, guard, answerModel) {
        "use strict";

        var
            getCollection = function (questionId) {
                return Q.fcall(function () {
                    guard.throwIfNotString(questionId, 'Question id is not a string');

                    return httpWrapper.post('api/answers', { questionId: questionId }).then(function (response) {
                        guard.throwIfNotAnObject(response, 'Response is not an object');
                        guard.throwIfNotArray(response.Answers, 'Answers is not an array');

                        return _.map(response.Answers, function (answer) {
                            return new answerModel({
                                id: answer.Id,
                                text: answer.Text,
                                isCorrect: answer.IsCorrect,
                                createdOn: answer.CreatedOn
                            });
                        });
                    });
                });
            },

            addAnswer = function (questionId, answer) {
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

                    return httpWrapper.post('api/answer/create', data).then(function (response) {
                        guard.throwIfNotAnObject(response, 'Response is not an object');
                        guard.throwIfNotString(response.Id, 'Answer id is not a string');
                        guard.throwIfNotString(response.CreatedOn, 'Answer creation date is not a string');

                        var createdOn = new Date(parseInt(response.CreatedOn.substr(6), 10));
                        updateQuestionModifiedOnDate(questionId, createdOn);

                        return {
                            id: response.Id,
                            createdOn: createdOn
                        };
                    });
                });
            },

            removeAnswer = function (questionId, answerId) {
                return Q.fcall(function () {
                    guard.throwIfNotString(questionId, 'Question id is not a string');
                    guard.throwIfNotString(answerId, 'Answer id is not a string');

                    var data = {
                        questionId: questionId,
                        answerId: answerId
                    };

                    return httpWrapper.post('api/answer/delete', data).then(function (response) {
                        guard.throwIfNotAnObject(response, 'Response is not an object');
                        guard.throwIfNotString(response.ModifiedOn, 'Response does not have modification date');

                        var modifiedOn = new Date(parseInt(response.ModifiedOn.substr(6), 10));
                        updateQuestionModifiedOnDate(questionId, modifiedOn);

                        return {
                            modifiedOn: modifiedOn
                        };
                    });
                });
            },

            updateAnswer = function (questionId, answerId, text, isCorrect) {
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

                    return httpWrapper.post('api/answer/update', data).then(function (response) {
                        guard.throwIfNotAnObject(response, 'Response is not an object');
                        guard.throwIfNotString(response.ModifiedOn, 'Answer modification date is not a string');

                        var modifiedOn = new Date(parseInt(response.ModifiedOn.substr(6), 10));
                        updateQuestionModifiedOnDate(questionId, modifiedOn);

                        return {
                            modifiedOn: modifiedOn
                        };
                    });
                });
            };


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

        return {
            getCollection: getCollection,

            addAnswer: addAnswer,
            removeAnswer: removeAnswer,
            updateAnswer: updateAnswer
        };
    });