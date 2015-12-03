
define(['durandal/app', 'dataContext', 'constants', 'http/apiHttpWrapper', 'guard', 'repositories/objectiveRepository', 'models/question', 'mappers/questionModelMapper'],
    function (app, dataContext, constants, apiHttpWrapper, guard, objectiveRepository, Question, questionModelMapper) {

        var
            addQuestion = function (objectiveId, obj, questionType) {
                return Q.fcall(function () {

                    guard.throwIfNotString(objectiveId, 'Objective id is not a string');
                    guard.throwIfNotAnObject(obj, 'Question data is not an object');

                    return apiHttpWrapper.post('api/question/' + questionType + '/create', { objectiveId: objectiveId, title: obj.title })
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

                            return createdQuestion;
                        });
                });
            },

            removeQuestions = function (objectiveId, questionIds) {

                return Q.fcall(function () {
                    guard.throwIfNotString(objectiveId, 'Objective id is not a string');
                    guard.throwIfNotArray(questionIds, 'Questions to remove are not an array');

                    return apiHttpWrapper.post('api/question/delete', { objectiveId: objectiveId, questions: questionIds })
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

                    return apiHttpWrapper.post('api/question/updateTitle', { questionId: questionId, title: title })
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

            updateVoiceOver = function (questionId, voiceOver) {
                return Q.fcall(function () {
                    guard.throwIfNotString(questionId, 'Question id is not a string');
                    
                    return apiHttpWrapper.post('api/question/updateVoiceOver', { questionId: questionId, voiceOver: voiceOver })
                        .then(function (response) {
                            guard.throwIfNotAnObject(response, 'Response is not an object');
                            guard.throwIfNotString(response.ModifiedOn, 'Response does not have modification date');

                            var question = _.find(getQuestions(), function (item) {
                                return item.id === questionId;
                            });

                            guard.throwIfNotAnObject(question, 'Question does not exist in dataContext');

                            var modifiedOn = new Date(response.ModifiedOn);

                            question.voiceOver = voiceOver;
                            question.modifiedOn = modifiedOn;

                            return modifiedOn;
                        });
                });
            },

            updateContent = function (questionId, content) {
                return Q.fcall(function () {
                    guard.throwIfNotString(questionId, 'Question id is not a string');

                    return apiHttpWrapper.post('api/question/updateContent', { questionId: questionId, content: content })
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

                    return apiHttpWrapper.post('api/question/fillintheblank/update', data)
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

            getFillInTheBlank = function (questionId) {
                return Q.fcall(function () {
                    guard.throwIfNotString(questionId, 'Question id is not a string');
                    var data = {
                        questionId: questionId
                    };

                    return apiHttpWrapper.post('api/question/fillintheblank', data)
                        .then(function (response) {
                            guard.throwIfNotAnObject(response, 'Response is not an object');

                            return response;
                        });
                });
            },

            getQuestionFeedback = function (questionId) {
                return Q.fcall(function () {
                    guard.throwIfNotString(questionId, 'Question id is not a string');

                    var data = {
                        questionId: questionId
                    };

                    return apiHttpWrapper.post('api/question/getQuestionFeedback', data)
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

                    return apiHttpWrapper.post('api/question/updateCorrectFeedback', data)
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

                    return apiHttpWrapper.post('api/question/updateIncorrectFeedback', data)
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

            updateLearningContentsOrder = function (questionId, learningContents) {
                return Q.fcall(function () {
                    guard.throwIfNotString(questionId, 'Question id (string) was expected');
                    guard.throwIfNotArray(learningContents, 'learningContents is not array');

                    var data = {
                        questionId: questionId,
                        learningContents: _.map(learningContents, function (item) {
                            return item.id;
                        })
                    };

                    return apiHttpWrapper.post('api/question/updateLearningContentsOrder', data)
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

                    if (!_.isObject(question)) {
                        deferred.reject('Question does not exist');
                    } else {
                        deferred.resolve(question);
                    }
                });

                return deferred.promise;
            },

            copyQuestion = function(questionId, objectiveId) {
                return Q.fcall(function() {
                    guard.throwIfNotString(questionId, 'Question id is not a string');
                    guard.throwIfNotString(objectiveId, 'Objective id is not a string');

                    return apiHttpWrapper.post('api/question/copy', { questionId: questionId, objectiveId: objectiveId })
                        .then(function(response) {
                            guard.throwIfNotAnObject(response, 'Response is not an object');

                            var objective = _.find(dataContext.objectives, function (item) {
                                return item.id === objectiveId;
                            });

                            guard.throwIfNotAnObject(objective, 'Objective does not exist in dataContext');

                            var question = questionModelMapper.map(response);
                            objective.questions.push(question);
                            objective.modifiedOn = question.createdOn;

                            app.trigger(constants.messages.question.created, objectiveId, question);
                            return question;
                        });
                });
            },

            moveQuestion = function (questionId, sourceObjectiveId, destinationObjectiveId) {
                return Q.fcall(function() {
                    guard.throwIfNotString(questionId, 'Question id is not a string');
                    guard.throwIfNotString(sourceObjectiveId, 'Source objective id is not a string');
                    guard.throwIfNotString(destinationObjectiveId, 'Destination objective id is not a string');

                    return apiHttpWrapper.post('api/question/move', { questionId: questionId, objectiveId: destinationObjectiveId })
                        .then(function(response) {
                            guard.throwIfNotAnObject(response, 'Response is not an object');
                            guard.throwIfNotString(response.ModifiedOn, 'Response does not have modification date');

                            var sourceObjective = _.find(dataContext.objectives, function (item) {
                                return item.id === sourceObjectiveId;
                                });

                            guard.throwIfNotAnObject(sourceObjective, 'Source objective does not exist in dataContext');

                            var destinationObjective = _.find(dataContext.objectives, function (item) {
                                return item.id === destinationObjectiveId;
                                });

                            guard.throwIfNotAnObject(destinationObjective, 'Destination objective does not exist in dataContext');

                            var question = _.find(sourceObjective.questions, function (item) {
                                return item.id === questionId;
                                });

                            guard.throwIfNotAnObject(question, 'Source objective does not contain moved question');

                            sourceObjective.questions = _.reject(sourceObjective.questions, function(item) {
                                return item.id === question.id;
                            });
                            destinationObjective.questions.push(question);

                            var modifiedOn = new Date(response.ModifiedOn);
                            sourceObjective.modifiedOn = modifiedOn;
                            destinationObjective.modifiedOn = modifiedOn;

                            app.trigger(constants.messages.question.deleted, sourceObjectiveId, [question.id]);
                            app.trigger(constants.messages.question.created, destinationObjectiveId, question);
                            return;
                        });
                });
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
            copyQuestion: copyQuestion,
            moveQuestion: moveQuestion,
            updateTitle: updateTitle,
            updateContent: updateContent,
            updateFillInTheBlank: updateFillInTheBlank,
            getFillInTheBlank: getFillInTheBlank,
            getQuestionFeedback: getQuestionFeedback,
            updateCorrectFeedback: updateCorrectFeedback,
            updateIncorrectFeedback: updateIncorrectFeedback,
            updateLearningContentsOrder: updateLearningContentsOrder,
            getById: getById,
            updateVoiceOver: updateVoiceOver
        };
    });
