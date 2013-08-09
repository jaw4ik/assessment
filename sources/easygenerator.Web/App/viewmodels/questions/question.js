﻿define(['dataContext', 'durandal/plugins/router', 'eventTracker', 'models/answerOption', 'models/explanation', 'localization/localizationManager', 'constants'],
    function (dataContext, router, eventTracker, answerOptionModel, expalantionModel, localizationManager, constants) {
        "use strict";
        var
            events = {
                category: 'Question',
                navigateToRelatedObjective: 'Navigate to related objective',
                navigateToNextQuestion: 'Navigate to next question',
                navigateToPreviousQuestion: 'Navigate to previous question',
                addAnswerOption: 'Add answer option',
                toggleAnswerCorrectness: 'Change answer option correctness',
                saveAnswerOption: 'Save the answer option text',
                deleteAnswerOption: 'Delete answer option',

                addExplanation: 'Add explanation',
                deleteExplanation: 'Delete explanation',
                startEditingExplanation: 'Start editing explanation',
                endEditingExplanation: 'End editing explanation'
            },

            sendEvent = function (eventName) {
                eventTracker.publish(eventName, events.category);
            };

        var objectiveId = '',
            question = ko.observable(),
            objectiveTitle = '',
            title = '',
            answerOptions = ko.observableArray([]),
            explanations = ko.observableArray([]),
            hasPrevious = false,
            hasNext = false,
            previousId = '',
            nextId = '',
            currentLanguage = ko.observable(''),
            lastAddedExplanation = ko.observable(null),
            isAnswersBlockExpanded = ko.observable(true),
            isExplanationsBlockExpanded = ko.observable(true),

            notification = {
                text: ko.observable(''),
                visibility: ko.observable(false),
                close: function () { notification.visibility(false); },
                update: function () {
                    var message = 'Last saving: ' + new Date().toLocaleTimeString();
                    notification.text(message);
                    notification.visibility(true);
                }
            },

            //#region Question

            goToRelatedObjective = function () {
                sendEvent(events.navigateToRelatedObjective);
                router.navigateTo('#/objective/' + this.objectiveId);
            },

            goToPreviousQuestion = function () {
                if (!hasPrevious)
                    router.navigateTo('#/404');

                sendEvent(events.navigateToPreviousQuestion);
                router.navigateTo('#/objective/' + this.objectiveId + '/question/' + this.previousId);
            },

            goToNextQuestion = function () {
                if (!hasNext)
                    router.navigateTo('#/404');

                sendEvent(events.navigateToNextQuestion);
                router.navigateTo('#/objective/' + this.objectiveId + '/question/' + this.nextId);
            },

            //#endregion Question

            //#region Answer options

            toggleAnswers = function () {
                this.isAnswersBlockExpanded(!isAnswersBlockExpanded());
            },

            addAnswerOption = function () {
                sendEvent(events.addAnswerOption);

                addAnswer(success);

                //TODO: temporary method. Would be changed, when dataContext will be reconstructed

                function addAnswer(callback) {
                    var newAnswer = new answerOptionModel({
                        id: generateNewEntryId(question().answerOptions),
                        text: '',
                        isCorrect: false
                    });

                    question().answerOptions.push(newAnswer);

                    if (_.isFunction(callback))
                        callback(newAnswer);
                }

                function success(newInstance) {
                    var observableAnswer = mapAnswerOption(newInstance);
                    observableAnswer.isInEdit(true);

                    answerOptions.push(observableAnswer);
                }
            },

            toggleAnswerCorrectness = function (instance) {
                sendEvent(events.toggleAnswerCorrectness);

                toggleCorrectness(instance, success);

                //TODO: temporary method. Would be changed, when dataContext will be reconstructed

                function toggleCorrectness(answer, callback) {
                    var currentAnswer = _.find(question().answerOptions, function (obj) {
                        return obj.id == answer.id;
                    });
                    if (_.isObject(currentAnswer)) {
                        var newValue = !currentAnswer.isCorrect;
                        currentAnswer.isCorrect = newValue;

                        if (_.isFunction(callback))
                            callback(newValue);
                    }
                }

                function success(value) {
                    instance.isCorrect(value);
                    notification.update();
                }
            },

            saveAnswerOption = function (instance) {
                sendEvent(events.saveAnswerOption);

                save(instance, success);

                //TODO: temporary method. Would be changed, when dataContext will be reconstructed

                function save(answer, callback) {
                    var currentAnswer = _.find(question().answerOptions, function (obj) {
                        return obj.id == answer.id;
                    });
                    if (_.isObject(currentAnswer) && currentAnswer.text !== answer.text()) {
                        currentAnswer.text = answer.text();

                        if (_.isFunction(callback))
                            callback();
                    }
                }

                function success() {
                    notification.update();
                }
            },

            deleteAnswerOption = function (instance) {
                sendEvent(events.deleteAnswerOption);

                deleteAnswer(instance, success);

                //TODO: temporary method. Would be changed, when dataContext will be reconstructed

                function deleteAnswer(answer, callback) {
                    question().answerOptions = _.reject(question().answerOptions, function (item) {
                        return item.id == answer.id;
                    });

                    if (_.isFunction(callback))
                        callback(answer);
                }

                function success(answer) {
                    answerOptions.remove(answer);
                }
            },

            mapAnswerOption = function (answer) {
                var mappedAnswerOption = {
                    id: answer.id,
                    text: ko.observable(answer.text || ''),
                    isCorrect: ko.observable(answer.isCorrect || false),
                    correctnessTooltip: function () {
                        return localizationManager.localize(this.isCorrect() ? 'correctAnswer' : 'incorrectAnswer');
                    },
                    isInEdit: ko.observable(false),
                    isEmpty: ko.observable(_.isEmptyOrWhitespace(answer.text))
                };

                (function (item) {
                    item.text.subscribe(function (value) {
                        item.isEmpty(_.isEmptyOrWhitespace(value));
                    });

                    var saveIntervalId = null;
                    item.isInEdit.subscribe(function (value) {

                        if (value) {
                            saveIntervalId = setInterval(function () {
                                saveAnswerOption(item);
                            }, constants.autosaveTimersDelay.answerOption);
                            return;
                        } else if (_.isEmptyOrWhitespace(item.text())) {
                            deleteAnswerOption(item);
                        } else {
                            saveAnswerOption(item);
                        }

                        clearInterval(saveIntervalId);
                    });
                })(mappedAnswerOption);

                return mappedAnswerOption;
            },

            //#endregion Answer options

            //#region Explanations

            toggleExplanations = function () {
                this.isExplanationsBlockExpanded(!isExplanationsBlockExpanded());

                if (!this.isExplanationsBlockExpanded()) {
                    finishEditingExplanations();
                }
            },

            addExplanation = function () {
                var explanation = mapExplanation(new expalantionModel({
                    id: this.explanations().length,
                    text: ''
                }));
                explanation.isEditing(true);

                lastAddedExplanation(explanation);
                this.explanations.push(explanation);
                sendEvent(events.addExplanation);
            },

            deleteExplanation = function (explanation) {
                this.question().explanations = _.reject(this.question().explanations, function (item) {
                    return item.id == explanation.id;
                });

                if (!!lastAddedExplanation() && explanation.id == lastAddedExplanation().id)
                    lastAddedExplanation(null);

                this.explanations.remove(explanation);
                removeSubscribersFromExplanation(explanation);
                sendEvent(events.deleteExplanation);
            },

            mapExplanation = function (explanation) {
                var mappedExplanation = {
                    text: ko.observable(explanation.text),
                    isEditing: ko.observable(false),
                    id: explanation.id
                };

                mappedExplanation.isEditing.subscribe(function (value) {
                    if (value) {
                        sendEvent(events.startEditingExplanation);
                    } else {
                        sendEvent(events.endEditingExplanation);
                    }
                });

                return mappedExplanation;
            },

            generateNewEntryId = function (collection) {
                var id = 0;
                if (collection.length > 0) {
                    var maxId = _.max(_.map(collection, function (exp) {
                        return parseInt(exp.id);
                    }));

                    id = maxId + 1;
                }

                return id;
            },

            saveExplanation = function (explanation) {
                if (_.isEmptyOrWhitespace(explanation.text())) {
                    if (!explanation.isEditing()) {
                        removeSubscribersFromExplanation(explanation);
                        explanations.remove(explanation);
                    }
                    return;
                }

                if (!explanation.isEditing() && explanation.id == lastAddedExplanation().id)
                    lastAddedExplanation(null);

                var contextExplanation = _.find(question().explanations, function (obj) {
                    return obj.id == explanation.id;
                });

                if (_.isObject(contextExplanation)) {
                    contextExplanation.text = explanation.text();
                }
                else {
                    question().explanations.push(
                        {
                            id: explanation.id,
                            text: explanation.text()
                        });
                }

                notification.update();
            },

            finishEditingExplanations = function () {
                _.each(explanations(), function (item) {
                    if (item.isEditing())
                        item.isEditing(false);
                });
            },

            canAddExplanation = ko.computed(function () {
                if (lastAddedExplanation() != null) {
                    return lastAddedExplanation().text().length != 0;
                } else
                    return true;
            }),

            removeSubscribersFromExplanation = function (explanation) {
                if (explanation.isEditing.getSubscriptionsCount() != 0)
                    _.each(explanation.isEditing._subscriptions.change, function (subscription) {
                        subscription.dispose();
                    });
            },

            //#endregion Explanations

            activate = function (routeData) {
                if (_.isEmpty(routeData) || _.isEmpty(routeData.objectiveId) || _.isEmpty(routeData.id)) {
                    router.navigateTo('#/400');
                    return;
                }

                var objective = _.find(dataContext.objectives, function (item) {
                    return item.id == routeData.objectiveId;
                });

                if (!_.isObject(objective)) {
                    router.navigateTo('#/404');
                    return;
                }

                this.question(_.find(objective.questions, function (item) {
                    return item.id == routeData.id;
                }));

                if (!_.isObject(this.question())) {
                    router.navigateTo('#/404');
                    return;
                }

                this.title = this.question().title;
                this.objectiveTitle = objective.title;
                this.objectiveId = objective.id;

                this.answerOptions(_.map(this.question().answerOptions, mapAnswerOption));
                this.explanations(_.map(this.question().explanations, mapExplanation));
                var questionIndex = objective.questions.indexOf(this.question());
                this.nextId = (objective.questions.length > questionIndex + 1) ? objective.questions[questionIndex + 1].id : null;
                this.previousId = (questionIndex != 0) ? objective.questions[questionIndex - 1].id : null;

                this.hasNext = this.nextId != null;
                this.hasPrevious = this.previousId != null;

                currentLanguage(localizationManager.currentLanguage);
                notification.visibility(false);
            },

            deactivate = function () {
                finishEditingExplanations();

                _.each(explanations(), function (item) {
                    removeSubscribersFromExplanation(item);
                });
            };

        return {
            objectiveId: objectiveId,
            question: question,

            objectiveTitle: objectiveTitle,
            title: title,
            answerOptions: answerOptions,
            explanations: explanations,
            hasPrevious: hasPrevious,
            hasNext: hasNext,

            activate: activate,
            deactivate: deactivate,

            goToRelatedObjective: goToRelatedObjective,
            goToPreviousQuestion: goToPreviousQuestion,
            goToNextQuestion: goToNextQuestion,

            isAnswersBlockExpanded: isAnswersBlockExpanded,
            toggleAnswers: toggleAnswers,
            addAnswerOption: addAnswerOption,
            toggleAnswerCorrectness: toggleAnswerCorrectness,
            saveAnswerOption: saveAnswerOption,
            deleteAnswerOption: deleteAnswerOption,

            isExplanationsBlockExpanded: isExplanationsBlockExpanded,
            toggleExplanations: toggleExplanations,
            canAddExplanation: canAddExplanation,
            addExplanation: addExplanation,
            deleteExplanation: deleteExplanation,
            saveExplanation: saveExplanation,
            explanationAutosaveInterval: constants.autosaveTimersDelay.explanation,

            notification: notification,
            language: currentLanguage,
            eventTracker: eventTracker
        };
    }
);