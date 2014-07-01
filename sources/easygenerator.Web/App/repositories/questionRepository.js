define(['durandal/app', 'dataContext', 'constants', 'http/httpWrapper', 'guard', 'repositories/objectiveRepository', 'models/question'],
    function (app, dataContext, constants, httpWrapper, guard, objectiveRepository, Question) {

        var
            addQuestion = function (objectiveId, obj, questionType) {
                return Q.fcall(function () {

                    guard.throwIfNotString(objectiveId, 'Objective id is not a string');
                    guard.throwIfNotAnObject(obj, 'Question data is not an object');

                    return httpWrapper.post('api/question/create/type/' + questionType, { objectiveId: objectiveId, title: obj.title })
                        .then(function (response) {
                            guard.throwIfNotAnObject(response, 'Response is not an object');
                            guard.throwIfNotString(response.Id, 'Question Id is not a string');
                            guard.throwIfNotString(response.CreatedOn, 'Question creation date is not a string');

                            var objective = _.find(dataContext.objectives, function (item) {
                                return item.id === objectiveId;
                            });

                            guard.throwIfNotAnObject(objective, 'Objective does not exist in dataContext');

                            var
                                createdOn = new Date(response.CreatedOn),
                                createdQuestion = new Question({
                                    id: response.Id,
                                    title: obj.title,
                                    content: obj.content,
                                    createdOn: createdOn,
                                    modifiedOn: createdOn,
                                    type: questionType
                                });

                            objective.modifiedOn = createdOn;
                            objective.questions.push(createdQuestion);

                            app.trigger(constants.messages.question.created, objectiveId, createdQuestion);

                            return {
                                id: createdQuestion.id,
                                createdOn: createdQuestion.createdOn
                            };
                        });
                });
            },

            removeQuestions = function (objectiveId, questionIds) {

                return Q.fcall(function () {
                    guard.throwIfNotString(objectiveId, 'Objective id is not a string');
                    guard.throwIfNotArray(questionIds, 'Questions to remove are not an array');

                    return httpWrapper.post('api/question/delete', { objectiveId: objectiveId, questions: questionIds })
                        .then(function (response) {
                            guard.throwIfNotAnObject(response, 'Response is not an object');
                            guard.throwIfNotString(response.ModifiedOn, 'Response does not have modification date');

                            var modifiedOn = new Date(response.ModifiedOn);

                            var objective = _.find(dataContext.objectives, function (item) {
                                return item.id == objectiveId;
                            });

                            guard.throwIfNotAnObject(objective, 'Objective does not exist in dataContext');

                            objective.modifiedOn = modifiedOn;
                            objective.questions = _.reject(objective.questions, function (item) {
                                return _.indexOf(questionIds, item.id) != -1;
                            });

                            app.trigger(constants.messages.question.deleted, objectiveId, questionIds);

                            return modifiedOn;
                        });
                });

            },

            updateTitle = function (questionId, title) {
                return Q.fcall(function () {
                    guard.throwIfNotString(questionId, 'Question id is not a string');
                    guard.throwIfNotString(title, 'Question title not a string');

                    return httpWrapper.post('api/question/updateTitle', { questionId: questionId, title: title })
                        .then(function (response) {
                            guard.throwIfNotAnObject(response, 'Response is not an object');
                            guard.throwIfNotString(response.ModifiedOn, 'Response does not have modification date');

                            var question = _.find(getQuestions(), function (item) {
                                return item.id == questionId;
                            });

                            guard.throwIfNotAnObject(question, 'Question does not exist in dataContext');

                            var modifiedOn = new Date(response.ModifiedOn);

                            question.title = title;
                            question.modifiedOn = modifiedOn;

                            app.trigger(constants.messages.question.titleUpdated, question);

                            return modifiedOn;
                        });
                });
            },

            updateContent = function (questionId, content) {
                return Q.fcall(function () {
                    guard.throwIfNotString(questionId, 'Question id is not a string');

                    return httpWrapper.post('api/question/updateContent', { questionId: questionId, content: content })
                        .then(function (response) {
                            guard.throwIfNotAnObject(response, 'Response is not an object');
                            guard.throwIfNotString(response.ModifiedOn, 'Response does not have modification date');

                            var question = _.find(getQuestions(), function (item) {
                                return item.id == questionId;
                            });

                            guard.throwIfNotAnObject(question, 'Question does not exist in dataContext');

                            var modifiedOn = new Date(response.ModifiedOn);

                            question.content = content;
                            question.modifiedOn = modifiedOn;

                            return modifiedOn;
                        });
                });
            },

            updateFillInTheBlank = function (questionId, fillInTheBlank, answersCollection) {
                return Q.fcall(function () {
                    guard.throwIfNotString(questionId, 'Question id is not a string');
                    var data = {
                        questionId: questionId,
                        fillInTheBlank: fillInTheBlank,
                        answersCollection: _.map(answersCollection, function (item) {
                            return {
                                GroupId: item.groupId,
                                Text: item.text,
                                IsCorrect: item.isCorrect
                            };
                        })
                    };

                    return httpWrapper.post('api/question/updatefillintheblank', data)
                        .then(function (response) {
                            guard.throwIfNotAnObject(response, 'Response is not an object');
                            guard.throwIfNotString(response.ModifiedOn, 'Response does not have modification date');

                            var question = _.find(getQuestions(), function (item) {
                                return item.id == questionId;
                            });

                            guard.throwIfNotAnObject(question, 'Question does not exist in dataContext');

                            var modifiedOn = new Date(response.ModifiedOn);

                            question.content = fillInTheBlank;
                            question.modifiedOn = modifiedOn;

                            return modifiedOn;
                        });
                });
            },

            getQuestionFeedback = function (questionId) {
                return Q.fcall(function () {
                    guard.throwIfNotString(questionId, 'Question id is not a string');

                    var data = {
                        questionId: questionId
                    };

                    return httpWrapper.post('api/question/getQuestionFeedback', data)
                        .then(function (response) {
                            guard.throwIfNotAnObject(response, 'Response is not an object');
                            guard.throwIfNotString(response.ModifiedOn, 'Response does not have modification date');

                            var question = _.find(getQuestions(), function (item) {
                                return item.id == questionId;
                            });

                            guard.throwIfNotAnObject(question, 'Question does not exist in dataContext');

                            question.modifiedOn = new Date(response.ModifiedOn);

                            return {
                                correctFeedbackText: response.CorrectFeedbackText,
                                incorrectFeedbackText: response.IncorrectFeedbackText
                            };
                        });
                });
            },

            updateCorrectFeedback = function (questionId, feedbackText) {
                return Q.fcall(function () {
                    guard.throwIfNotString(questionId, 'Question id is not a string');

                    var data = {
                        questionId: questionId,
                        feedbackText: feedbackText
                    };

                    return httpWrapper.post('api/question/updateCorrectFeedback', data)
                        .then(function (response) {
                            guard.throwIfNotAnObject(response, 'Response is not an object');
                            guard.throwIfNotString(response.ModifiedOn, 'Response does not have modification date');

                            var question = _.find(getQuestions(), function (item) {
                                return item.id == questionId;
                            });

                            guard.throwIfNotAnObject(question, 'Question does not exist in dataContext');

                            var modifiedOn = new Date(response.ModifiedOn);
                            question.modifiedOn = modifiedOn;

                            return modifiedOn;
                        });
                });
            },

            updateIncorrectFeedback = function (questionId, feedbackText) {
                return Q.fcall(function () {
                    guard.throwIfNotString(questionId, 'Question id is not a string');

                    var data = {
                        questionId: questionId,
                        feedbackText: feedbackText
                    };

                    return httpWrapper.post('api/question/updateIncorrectFeedback', data)
                        .then(function (response) {
                            guard.throwIfNotAnObject(response, 'Response is not an object');
                            guard.throwIfNotString(response.ModifiedOn, 'Response does not have modification date');

                            var question = _.find(getQuestions(), function (item) {
                                return item.id == questionId;
                            });

                            guard.throwIfNotAnObject(question, 'Question does not exist in dataContext');

                            var modifiedOn = new Date(response.ModifiedOn);
                            question.modifiedOn = modifiedOn;

                            return modifiedOn;
                        });
                });
            },

            getById = function (objectiveId, questionId) {
                if (_.isNullOrUndefined(objectiveId) || _.isNullOrUndefined(questionId)) {
                    throw 'Invalid arguments';
                }

                var deferred = Q.defer();

                objectiveRepository.getById(objectiveId).then(function (objective) {
                    if (!_.isObject(objective)) {
                        deferred.reject('Objective does not exist');
                    }

                    var question = _.find(objective.questions, function (item) {
                        return item.id === questionId;
                    });

                    deferred.resolve(question);
                });

                return deferred.promise;
            }
        ;

        function getQuestions() {
            var questions = [];
            _.each(dataContext.objectives, function (objective) {
                questions.push.apply(questions, objective.questions);
            });
            return questions;
        }

        return {
            addQuestion: addQuestion,
            removeQuestions: removeQuestions,
            updateTitle: updateTitle,
            updateContent: updateContent,
            updateFillInTheBlank: updateFillInTheBlank,
            getQuestionFeedback: getQuestionFeedback,
            updateCorrectFeedback: updateCorrectFeedback,
            updateIncorrectFeedback: updateIncorrectFeedback,
            getById: getById
        };
    });
