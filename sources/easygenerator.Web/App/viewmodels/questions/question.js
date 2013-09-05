define(['plugins/router', 'eventTracker', 'models/answerOption', 'models/explanation', 'localization/localizationManager', 'constants', 'repositories/questionRepository', 'repositories/objectiveRepository', 'durandal/system'],
    function (router, eventTracker, answerOptionModel, expalantionModel, localizationManager, constants, questionRepository, objectiveRepository, system) {
        "use strict";
        var
            events = {
                category: 'Question',
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

                addExplanation: 'Add explanation',
                deleteExplanation: 'Delete explanation',
                startEditingExplanation: 'Start editing explanation',
                endEditingExplanation: 'End editing explanation'
            },

            sendEvent = function (eventName) {
                eventTracker.publish(eventName, events.category);
            };

        var
            objectiveId = '',
            questionId = '',
            previousId = '',
            nextId = '',
            objectiveTitle = '',
            createdOn = null,
            modifiedOn = ko.observable(),
            questionTitleMaxLength = 255,
            answerOptions = ko.observableArray([]),
            explanations = ko.observableArray([]),
            hasPrevious = false,
            hasNext = false,
            lastAddedExplanation = ko.observable(null),
            isAnswersBlockExpanded = ko.observable(true),
            isExplanationsBlockExpanded = ko.observable(true),
            title = ko.observable('').extend({
                required: true,
                maxLength: questionTitleMaxLength
            }),
            language = ko.observable();

        title.isEditing = ko.observable();

        var notification = {
            text: ko.observable(''),
            visibility: ko.observable(false),
            close: function () { notification.visibility(false); },
            update: function () {
                var message = localizationManager.localize('lastSaving') + ': ' + new Date().toLocaleTimeString();
                notification.text(message);
                notification.visibility(true);
            }
        },

        //#region Question

        goToRelatedObjective = function () {
            sendEvent(events.navigateToRelatedObjective);
            router.navigate('objective/' + objectiveId);
        },

        goToPreviousQuestion = function () {
            if (!this.hasPrevious)
                router.replace('404');

            sendEvent(events.navigateToPreviousQuestion);
            router.navigate('objective/' + objectiveId + '/question/' + previousId);
        },

        goToNextQuestion = function () {
            if (!this.hasNext)
                router.replace('404');

            sendEvent(events.navigateToNextQuestion);
            router.navigate('objective/' + objectiveId + '/question/' + nextId);
        },

        goToCreateQuestion = function () {
            sendEvent(events.navigateToCreateQuestion);
            router.navigate('objective/' + objectiveId + '/question/create');
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
                    questionRepository.update(objectiveId, { id: questionId, title: title() }).then(function (updatedQuestion) {
                        that.modifiedOn(updatedQuestion.modifiedOn);
                        notification.update();
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
                        notification.update();
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
                        notification.update();
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
                    notification.update();
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

        //#region Explanations

        toggleExplanations = function () {
            isExplanationsBlockExpanded(!isExplanationsBlockExpanded());

            if (!isExplanationsBlockExpanded()) {
                finishEditingExplanations.apply(this);
            }
        },

        addExplanation = function () {
            var explanation = mapExplanation(new expalantionModel({
                id: generateNewEntryId(),
                text: ''
            }));

            explanation.isEditing(true);

            lastAddedExplanation(explanation);
            explanations.push(explanation);
            sendEvent(events.addExplanation);
        },

        deleteExplanation = function (explanation) {
            sendEvent(events.deleteExplanation);

            questionRepository.getById(objectiveId, questionId)
                .then(function (question) {
                    if (!!lastAddedExplanation() && explanation.id === lastAddedExplanation().id) {
                        lastAddedExplanation(null);
                    }

                    explanations(_.reject(explanations(), function (item) {
                        return item.id === explanation.id;
                    }));

                    question.explanations = _.reject(question.explanations, function (item) {
                        return item.id === explanation.id;
                    });

                    removeSubscribersFromExplanation(explanation);
                });
        },

        mapExplanation = function (explanation) {
            var mappedExplanation = {
                text: ko.observable(explanation.text),
                isEditing: ko.observable(false),
                id: explanation.id
            };

            mappedExplanation.editingSubscription = mappedExplanation.isEditing.subscribe(function (value) {
                if (value) {
                    sendEvent(events.startEditingExplanation);
                } else {
                    sendEvent(events.endEditingExplanation);
                }
            });

            return mappedExplanation;
        },

        saveExplanation = function (explanation) {
            if (!explanation.isEditing() && !!lastAddedExplanation() && explanation.id === lastAddedExplanation().id)
                lastAddedExplanation(null);

            questionRepository.getById(objectiveId, questionId)
                .then(function (question) {
                    if (_.isEmptyOrWhitespace(explanation.text())) {
                        if (!explanation.isEditing()) {
                            removeSubscribersFromExplanation(explanation);

                            explanations.remove(explanation);
                            question.explanations = _.reject(question.explanations, function (item) {
                                return item.id === explanation.id;
                            });
                        }
                        return;
                    }

                    var contextExplanation = _.find(question.explanations, function (obj) {
                        return obj.id === explanation.id;
                    });

                    if (_.isObject(contextExplanation)) {
                        contextExplanation.text = explanation.text();
                    }
                    else {
                        question.explanations.push({
                            id: explanation.id,
                            text: explanation.text()
                        });
                    }

                    notification.update();
                });
        },

        finishEditingExplanations = function () {
            var that = this;
            _.each(explanations(), function (item) {
                if (item.isEditing()) {
                    item.isEditing(false);
                    saveExplanation.call(that, item);
                }
            });
        },

        canAddExplanation = ko.computed(function () {
            if (lastAddedExplanation() != null) {
                return lastAddedExplanation().text().length != 0;
            } else {
                return true;
            }
        }),

        removeSubscribersFromExplanation = function (explanation) {
            if (!!explanation.editingSubscription)
                explanation.editingSubscription.dispose();
        },

        //#endregion Explanations

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

                    var mappedExplanations = _.map(question.explanations, function (item) {
                        return mapExplanation.call(that, item);
                    });
                    that.explanations(mappedExplanations);

                    var questionIndex = objective.questions.indexOf(question);
                    nextId = (objective.questions.length > questionIndex + 1) ? objective.questions[questionIndex + 1].id : null;
                    previousId = (questionIndex != 0) ? objective.questions[questionIndex - 1].id : null;

                    that.hasNext = nextId != null;
                    that.hasPrevious = previousId != null;

                    notification.visibility(false);
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
            finishEditingExplanations();

            _.each(explanations(), function (item) {
                removeSubscribersFromExplanation(item);
            });

            _.each(answerOptions(), function(item) {
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
            questionTitleMaxLength: questionTitleMaxLength,
            answerOptions: answerOptions,
            explanations: explanations,
            hasPrevious: hasPrevious,
            hasNext: hasNext,
            language: language,
            isAnswersBlockExpanded: isAnswersBlockExpanded,
            isExplanationsBlockExpanded: isExplanationsBlockExpanded,
            notification: notification,
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

            toggleExplanations: toggleExplanations,
            canAddExplanation: canAddExplanation,
            addExplanation: addExplanation,
            deleteExplanation: deleteExplanation,
            saveExplanation: saveExplanation,
            explanationAutosaveInterval: constants.autosaveTimersInterval.explanation
            //#endregion Methods
        };
    }
);