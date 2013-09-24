define(['plugins/router', 'eventTracker', 'models/answerOption', 'models/learningObject', 'localization/localizationManager', 'constants', 'repositories/questionRepository', 'repositories/objectiveRepository', 'durandal/system', 'notify'],
    function (router, eventTracker, answerOptionModel, learningObjectModel, localizationManager, constants, questionRepository, objectiveRepository, system, notify) {
        "use strict";
        var
            events = {
                navigateToRelatedObjective: 'Navigate to related objective',
                navigateToNextQuestion: 'Navigate to next question',
                navigateToPreviousQuestion: 'Navigate to previous question',
                updateQuestionTitle: 'Update question title',
                navigateToCreateQuestion: 'Navigate to create question',

                addAnswerOption: 'Add answer option',
                toggleAnswerCorrectness: 'Change answer option correctness',
                saveAnswerOption: 'Save the answer option text',
                deleteAnswerOption: 'Delete answer option',
                startEditingAnswerOption: 'Start editing answer option',
                endEditingAnswerOption: 'End editing answer option',

                addLearningObject: 'Add learning object',
                deleteLearningObject: 'Delete learning object',
                startEditingLearningObject: 'Start editing learning object',
                EndEditingLearningObject: 'End editing learning object'
            },

            sendEvent = function (eventName) {
                eventTracker.publish(eventName);
            };

        var
            objectiveId = '',
            questionId = '',
            previousId = '',
            nextId = '',
            objectiveTitle = '',
            createdOn = null,
            modifiedOn = ko.observable(),
            answerOptions = ko.observableArray([]),
            learningObjects = ko.observableArray([]),
            hasPrevious = false,
            hasNext = false,
            lastAddedLearningObject = ko.observable(null),
            isAnswersBlockExpanded = ko.observable(true),
            isLearningObjectsBlockExpanded = ko.observable(true),
            title = ko.observable(''),
            language = ko.observable();

        title.isEditing = ko.observable();
        title.isValid = ko.computed(function () {
            var length = title().trim().length;
            return length > 0 && length <= constants.validation.questionTitleMaxLength;
        });
        //#region Question

        var
            goToRelatedObjective = function () {
                sendEvent(events.navigateToRelatedObjective);
                router.navigateWithQueryString('objective/' + objectiveId);
            },

            goToPreviousQuestion = function () {
                if (!this.hasPrevious)
                    router.replace('404');

                sendEvent(events.navigateToPreviousQuestion);
                router.navigateWithQueryString('objective/' + objectiveId + '/question/' + previousId);
            },

            goToNextQuestion = function () {
                if (!this.hasNext)
                    router.replace('404');

                sendEvent(events.navigateToNextQuestion);
                router.navigateWithQueryString('objective/' + objectiveId + '/question/' + nextId);
            },

            goToCreateQuestion = function () {
                sendEvent(events.navigateToCreateQuestion);
                router.navigateWithQueryString('objective/' + objectiveId + '/question/create');
            },

            startEditQuestionTitle = function () {
                title.isEditing(true);
            },

            endEditQuestionTitle = function () {
                title(title().trim());
                title.isEditing(false);

                var that = this;
                var questionTitle = null;
                questionRepository.getById(objectiveId, questionId).then(function (response) {
                    questionTitle = response.title;

                    if (title() == questionTitle)
                        return;

                    sendEvent(events.updateQuestionTitle);

                    if (title.isValid()) {
                        questionRepository.updateTitle(questionId, title()).then(function (modifiedOn) {
                            that.modifiedOn(modifiedOn);
                            notify.info(localizationManager.localize('lastSaving') + ': ' + new Date().toLocaleTimeString());
                        });
                    } else {
                        title(questionTitle);
                    }
                });
            },

        //#endregion Question

        //#region Answer options

            toggleAnswers = function () {
                isAnswersBlockExpanded(!isAnswersBlockExpanded());
            },

            addAnswerOption = function () {
                sendEvent(events.addAnswerOption);

                questionRepository.getById(objectiveId, questionId)
                    .then(function (question) {
                        var newAnswer = new answerOptionModel({
                            id: generateNewEntryId(),
                            text: '',
                            isCorrect: false
                        });

                        question.answerOptions.push(newAnswer);

                        var mappedNewAnswer = mapAnswerOption(newAnswer);
                        mappedNewAnswer.isInEdit(true);
                        answerOptions.push(mappedNewAnswer);
                    });
            },

            toggleAnswerCorrectness = function (answerOption) {
                sendEvent(events.toggleAnswerCorrectness);

                questionRepository.getById(objectiveId, questionId)
                    .then(function (question) {
                        var currentAnswer = _.find(question.answerOptions, function (obj) {
                            return obj.id === answerOption.id;
                        });

                        if (_.isObject(currentAnswer)) {
                            var newValue = !currentAnswer.isCorrect;
                            currentAnswer.isCorrect = newValue;
                            answerOption.isCorrect(newValue);
                            notify.info(localizationManager.localize('lastSaving') + ': ' + new Date().toLocaleTimeString());
                        }
                    });
            },

            saveAnswerOption = function (answerOption) {
                sendEvent(events.saveAnswerOption);

                questionRepository.getById(objectiveId, questionId)
                    .then(function (question) {
                        var currentAnswer = _.find(question.answerOptions, function (obj) {
                            return obj.id === answerOption.id;
                        });

                        if (_.isObject(currentAnswer) && currentAnswer.text !== answerOption.text()) {
                            currentAnswer.text = answerOption.text();
                            notify.info(localizationManager.localize('lastSaving') + ': ' + new Date().toLocaleTimeString());
                        }
                    });
            },

            deleteAnswerOption = function (answerOption) {
                sendEvent(events.deleteAnswerOption);

                questionRepository.getById(objectiveId, questionId)
                    .then(function (question) {
                        question.answerOptions = _.reject(question.answerOptions, function (item) {
                            return item.id === answerOption.id;
                        });

                        answerOptions.remove(answerOption);
                        notify.info(localizationManager.localize('lastSaving') + ': ' + new Date().toLocaleTimeString());
                    });
            },

            mapAnswerOption = function (answerOption) {
                var mappedAnswerOption = {
                    id: answerOption.id,
                    text: ko.observable(answerOption.text || ''),
                    isCorrect: ko.observable(answerOption.isCorrect || false),
                    correctnessTooltip: function () {
                        return localizationManager.localize(this.isCorrect() ? 'correctAnswer' : 'incorrectAnswer');
                    },
                    isInEdit: ko.observable(false),
                    isEmpty: ko.observable(_.isEmptyOrWhitespace(answerOption.text)),
                    _subscriptions: []
                };

                mappedAnswerOption._subscriptions.push(
                    mappedAnswerOption.text.subscribe(function (value) {
                        mappedAnswerOption.isEmpty(_.isEmptyOrWhitespace(value));
                    })
                );

                var saveIntervalId = null;
                mappedAnswerOption._subscriptions.push(
                    mappedAnswerOption.isInEdit.subscribe(function (value) {
                        if (value) {
                            sendEvent(events.startEditingAnswerOption);

                            saveIntervalId = setInterval(function () {
                                saveAnswerOption(mappedAnswerOption);
                            }, constants.autosaveTimersInterval.answerOption);
                            return;
                        } else if (_.isEmptyOrWhitespace(mappedAnswerOption.text())) {
                            deleteAnswerOption(mappedAnswerOption);
                        } else {
                            saveAnswerOption(mappedAnswerOption);
                        }

                        sendEvent(events.endEditingAnswerOption);
                        clearInterval(saveIntervalId);
                    })
                );

                return mappedAnswerOption;
            },

            generateNewEntryId = function () {
                return system.guid().replace(/[-]/g, '');
            },

        //#endregion Answer options

        //#region Learning objects

            toggleLearningObjects = function () {
                isLearningObjectsBlockExpanded(!isLearningObjectsBlockExpanded());

                if (!isLearningObjectsBlockExpanded()) {
                    finishEditingLearningObjects.apply(this);
                }
            },

            addLearningObject = function () {
                var learningObject = mapLearningObject(new learningObjectModel({
                    id: generateNewEntryId(),
                    text: ''
                }));

                learningObject.isEditing(true);

                lastAddedLearningObject(learningObject);
                learningObjects.push(learningObject);
                sendEvent(events.addLearningObject);
            },

            deleteLearningObject = function (learningObject) {
                sendEvent(events.deleteLearningObject);

                questionRepository.getById(objectiveId, questionId)
                    .then(function (question) {
                        if (!!lastAddedLearningObject() && learningObject.id === lastAddedLearningObject().id) {
                            lastAddedLearningObject(null);
                        }

                        learningObjects(_.reject(learningObjects(), function (item) {
                            return item.id === learningObject.id;
                        }));

                        question.learningObjects = _.reject(question.learningObjects, function (item) {
                            return item.id === learningObject.id;
                        });

                        removeSubscribersFromLearningObject(learningObject);
                    });
            },

            mapLearningObject = function (learningObject) {
                var mappedLearningObject = {
                    text: ko.observable(learningObject.text),
                    isEditing: ko.observable(false),
                    id: learningObject.id
                };

                mappedLearningObject.editingSubscription = mappedLearningObject.isEditing.subscribe(function (value) {
                    if (value) {
                        sendEvent(events.startEditingLearningObject);
                    } else {
                        sendEvent(events.endEditingLearingObject);
                    }
                });

                return mappedLearningObject;
            },

            saveLearningObject = function (learningObject) {
                if (!learningObject.isEditing() && !!lastAddedLearningObject() && learningObject.id === lastAddedLearningObject().id)
                    lastAddedLearningObject(null);

                questionRepository.getById(objectiveId, questionId)
                    .then(function (question) {
                        if (_.isEmptyOrWhitespace(learningObject.text())) {
                            if (!learningObject.isEditing()) {
                                removeSubscribersFromLearningObject(learningObject);

                                learningObjects.remove(learningObject);
                                question.learningObjects = _.reject(question.learningObjects, function (item) {
                                    return item.id === learningObject.id;
                                });
                            }
                            return;
                        }

                        var contextLearningObject = _.find(question.learningObjects, function (obj) {
                            return obj.id === learningObject.id;
                        });
                        
                        if (!_.isObject(contextLearningObject) || (contextLearningObject.text != learningObject.text()))
                            notify.info(localizationManager.localize('lastSaving') + ': ' + new Date().toLocaleTimeString());
                        
                        if (_.isObject(contextLearningObject))
                            contextLearningObject.text = learningObject.text();
                        else
                            question.learningObjects.push({
                                id: learningObject.id,
                                text: learningObject.text()
                            });
                    });
            },

            finishEditingLearningObjects = function () {
                var that = this;
                _.each(learningObjects(), function (item) {
                    if (item.isEditing()) {
                        item.isEditing(false);
                        saveLearningObject.call(that, item);
                    }
                });
            },

            canAddLearningObject = ko.computed(function () {
                if (lastAddedLearningObject() != null) {
                    return lastAddedLearningObject().text().length != 0;
                } else {
                    return true;
                }
            }),

            removeSubscribersFromLearningObject = function (learningObject) {
                if (!!learningObject.editingSubscription)
                    learningObject.editingSubscription.dispose();
            },

        //#endregion Learning objects

            activate = function (objId, quesId) {
                if (!_.isString(objId) || !_.isString(quesId)) {
                    router.replace('400');
                    return undefined;
                }

                objectiveId = objId;
                questionId = quesId;
                this.language(localizationManager.currentLanguage);
                
                var that = this;
                return objectiveRepository.getById(objId).then(function (objective) {
                    questionRepository.getById(objectiveId, questionId).then(function (question) {
                        that.title(question.title);
                        that.objectiveTitle = objective.title;
                        that.createdOn = question.createdOn;
                        that.modifiedOn(question.modifiedOn);

                        var mappedAnswerOptions = _.map(question.answerOptions, function (item) {
                            return mapAnswerOption.call(that, item);
                        });
                        that.answerOptions(mappedAnswerOptions);

                        var mappedLearningObjects = _.map(question.learningObjects, function (item) {
                            return mapLearningObject.call(that, item);
                        });
                        that.learningObjects(mappedLearningObjects);

                        var questionIndex = objective.questions.indexOf(question);
                        nextId = (objective.questions.length > questionIndex + 1) ? objective.questions[questionIndex + 1].id : null;
                        previousId = (questionIndex != 0) ? objective.questions[questionIndex - 1].id : null;

                        that.hasNext = nextId != null;
                        that.hasPrevious = previousId != null;
                    })
                    .fail(function () {
                        router.replace('404');
                        return;
                    });
                }).fail(function () {
                    router.replace('404');
                    return;
                });
            },

            deactivate = function () {
                finishEditingLearningObjects();

                _.each(learningObjects(), function (item) {
                    removeSubscribersFromLearningObject(item);
                });

                _.each(answerOptions(), function (item) {
                    item.isInEdit(false);

                    _.each(item._subscriptions, function (subscription) {
                        subscription.dispose();
                    });
                });
            };

        return {
            //#region Properties
            objectiveTitle: objectiveTitle,
            title: title,
            createdOn: createdOn,
            modifiedOn: modifiedOn,
            questionTitleMaxLength: constants.validation.questionTitleMaxLength,
            answerOptions: answerOptions,
            learningObjects: learningObjects,
            hasPrevious: hasPrevious,
            hasNext: hasNext,
            language: language,
            isAnswersBlockExpanded: isAnswersBlockExpanded,
            isLearningObjectsBlockExpanded: isLearningObjectsBlockExpanded,
            eventTracker: eventTracker,
            //#endregion Properties

            //#region Methods
            activate: activate,
            deactivate: deactivate,

            goToRelatedObjective: goToRelatedObjective,
            goToPreviousQuestion: goToPreviousQuestion,
            goToNextQuestion: goToNextQuestion,
            goToCreateQuestion: goToCreateQuestion,
            startEditQuestionTitle: startEditQuestionTitle,
            endEditQuestionTitle: endEditQuestionTitle,

            toggleAnswers: toggleAnswers,
            addAnswerOption: addAnswerOption,
            toggleAnswerCorrectness: toggleAnswerCorrectness,
            saveAnswerOption: saveAnswerOption,
            deleteAnswerOption: deleteAnswerOption,

            toggleLearningObjects: toggleLearningObjects,
            canAddLearningObject: canAddLearningObject,
            addLearningObject: addLearningObject,
            deleteLearningObject: deleteLearningObject,
            saveLearningObject: saveLearningObject,
            learningObjectAutosaveInterval: constants.autosaveTimersInterval.learningObject
            //#endregion Methods
        };
    }
);