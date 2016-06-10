define(['durandal/app', 'dataContext', 'constants', 'http/apiHttpWrapper', 'guard', './sectionRepository', 'models/question', 'mappers/questionModelMapper'],
    function (app, dataContext, constants, apiHttpWrapper, guard, sectionRepository, Question, questionModelMapper) {

        var
            addQuestion = function (sectionId, obj, questionType) {
                return Q.fcall(function () {

                    guard.throwIfNotString(sectionId, 'Section id is not a string');
                    guard.throwIfNotAnObject(obj, 'Question data is not an object');

                    return apiHttpWrapper.post('api/question/' + questionType + '/create', { sectionId: sectionId, title: obj.title })
                        .then(function (response) {
                            guard.throwIfNotAnObject(response, 'Response is not an object');
                            guard.throwIfNotString(response.Id, 'Question Id is not a string');
                            guard.throwIfNotString(response.CreatedOn, 'Question creation date is not a string');

                            var section = _.find(dataContext.sections, function (item) {
                                return item.id === sectionId;
                            });

                            guard.throwIfNotAnObject(section, 'Section does not exist in dataContext');

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

                            section.modifiedOn = createdOn;
                            section.questions.push(createdQuestion);

                            app.trigger(constants.messages.question.created, sectionId, createdQuestion);

                            return createdQuestion;
                        });
                });
            },

            removeQuestions = function (sectionId, questionIds) {

                return Q.fcall(function () {
                    guard.throwIfNotString(sectionId, 'Section id is not a string');
                    guard.throwIfNotArray(questionIds, 'Questions to remove are not an array');

                    return apiHttpWrapper.post('api/question/delete', { sectionId: sectionId, questions: questionIds })
                        .then(function (response) {
                            guard.throwIfNotAnObject(response, 'Response is not an object');
                            guard.throwIfNotString(response.ModifiedOn, 'Response does not have modification date');

                            var modifiedOn = new Date(response.ModifiedOn);

                            var section = _.find(dataContext.sections, function (item) {
                                return item.id == sectionId;
                            });

                            guard.throwIfNotAnObject(section, 'Section does not exist in dataContext');

                            section.modifiedOn = modifiedOn;
                            section.questions = _.reject(section.questions, function (item) {
                                return _.indexOf(questionIds, item.id) != -1;
                            });

                            app.trigger(constants.messages.question.deleted, sectionId, questionIds);

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
                                IsCorrect: item.isCorrect,
                                MatchCase: item.matchCase
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

            getById = function (sectionId, questionId) {
                if (_.isNullOrUndefined(sectionId) || _.isNullOrUndefined(questionId)) {
                    throw 'Invalid arguments';
                }

                var deferred = Q.defer();

                sectionRepository.getById(sectionId).then(function (section) {
                    if (!_.isObject(section)) {
                        deferred.reject('Section does not exist');
                    }

                    var question = _.find(section.questions, function (item) {
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

            copyQuestion = function(questionId, sectionId) {
                return Q.fcall(function() {
                    guard.throwIfNotString(questionId, 'Question id is not a string');
                    guard.throwIfNotString(sectionId, 'Section id is not a string');

                    return apiHttpWrapper.post('api/question/copy', { questionId: questionId, sectionId: sectionId })
                        .then(function(response) {
                            guard.throwIfNotAnObject(response, 'Response is not an object');

                            var section = _.find(dataContext.sections, function (item) {
                                return item.id === sectionId;
                            });

                            guard.throwIfNotAnObject(section, 'Section does not exist in dataContext');

                            var question = questionModelMapper.map(response);
                            section.questions.push(question);
                            section.modifiedOn = question.createdOn;

                            app.trigger(constants.messages.question.created, sectionId, question);
                            return question;
                        });
                });
            },

            moveQuestion = function (questionId, sourceSectionId, destinationSectionId) {
                return Q.fcall(function() {
                    guard.throwIfNotString(questionId, 'Question id is not a string');
                    guard.throwIfNotString(sourceSectionId, 'Source section id is not a string');
                    guard.throwIfNotString(destinationSectionId, 'Destination section id is not a string');

                    return apiHttpWrapper.post('api/question/move', { questionId: questionId, sectionId: destinationSectionId })
                        .then(function(response) {
                            guard.throwIfNotAnObject(response, 'Response is not an object');
                            guard.throwIfNotString(response.ModifiedOn, 'Response does not have modification date');

                            var sourceSection = _.find(dataContext.sections, function (item) {
                                return item.id === sourceSectionId;
                                });

                            guard.throwIfNotAnObject(sourceSection, 'Source section does not exist in dataContext');

                            var destinationSection = _.find(dataContext.sections, function (item) {
                                return item.id === destinationSectionId;
                                });

                            guard.throwIfNotAnObject(destinationSection, 'Destination section does not exist in dataContext');

                            var question = _.find(sourceSection.questions, function (item) {
                                return item.id === questionId;
                                });

                            guard.throwIfNotAnObject(question, 'Source section does not contain moved question');

                            sourceSection.questions = _.reject(sourceSection.questions, function(item) {
                                return item.id === question.id;
                            });
                            destinationSection.questions.push(question);

                            var modifiedOn = new Date(response.ModifiedOn);
                            sourceSection.modifiedOn = modifiedOn;
                            destinationSection.modifiedOn = modifiedOn;

                            app.trigger(constants.messages.question.deleted, sourceSectionId, [question.id]);
                            app.trigger(constants.messages.question.created, destinationSectionId, question);
                            return;
                        });
                });
            }
        ;

        function getQuestions() {
            var questions = [];
            _.each(dataContext.sections, function (section) {
                questions.push.apply(questions, section.questions);
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
