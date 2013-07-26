﻿define(['dataContext', 'durandal/plugins/router', 'eventTracker', 'models/answerOption', 'models/explanation', 'localization/localizationManager'],
    function (dataContext, router, eventTracker, answerOptionModel, expalantionModel, localizationManager) {
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
            canAddExplanation = ko.observable(true),
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
            toggleAnswers = function () {
                this.isAnswersBlockExpanded(!isAnswersBlockExpanded());
            },
            toggleExplanations = function () {
                this.isExplanationsBlockExpanded(!isExplanationsBlockExpanded());
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

                function success(answer) {
                    var observableAnswer = mapAnswerOption(answer);
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
            saveAnswerOption = function (instance, context) {
                sendEvent(events.saveAnswerOption);

                if (_.isEmptyOrWhitespace(context.target.value)) {
                    deleteAnswerOption(instance);
                    return;
                }

                save(instance, context.target.value, success);

                //TODO: temporary method. Would be changed, when dataContext will be reconstructed

                function save(answer, value, callback) {
                    var currentAnswer = _.find(question().answerOptions, function (obj) {
                        return obj.id == answer.id;
                    });
                    if (_.isObject(currentAnswer)) {
                        currentAnswer.text = value;

                        if (_.isFunction(callback))
                            callback(value);
                    }
                }

                function success(value) {
                    instance.text = value;
                    notification.update();
                }
            },
            updateAnswerOptionText = function (instance, context) {
                instance.isEmpty(_.isEmptyOrWhitespace(context.target.value));
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
            addExplanation = function () {
                sendEvent(events.addExplanation);
                var explanation = mapExplanation(new expalantionModel({
                    id: this.explanations().length,
                    text: ''
                }));

                canAddExplanation(false);
                explanation.isEditing(true);

                this.explanations.push(explanation);
            },
            editExplanation = function (explanation) {
                explanation.isEditing(true);
                sendEvent(events.startEditingExplanation);
            },
            endEditExplanation = function (explanation) {
                if (_.isEmptyOrWhitespace(explanation.text())) {
                    this.explanations.remove(explanation);
                    canAddExplanation(true);
                    return;
                }

                saveExplanation(explanation.id, explanation.text());

                explanation.isEditing(false);
                sendEvent(events.endEditingExplanation);
            },
            deleteExplanation = function (explanation) {
                sendEvent(events.deleteExplanation);
                this.question().explanations = _.reject(this.question().explanations, function (item) {
                    return item.id == explanation.id;
                });

                if (explanation.id == _.last(this.explanations()).id && !this.canAddExplanation())
                    this.canAddExplanation(true);

                this.explanations.remove(explanation);
            },
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
            mapAnswerOption = function (answer) {
                return {
                    id: answer.id,
                    text: answer.text || '',
                    isCorrect: ko.observable(answer.isCorrect || false),
                    isInEdit: ko.observable(false),
                    isEmpty: ko.observable(answer.text == '')
                };
            },
            mapExplanation = function (explanation) {
                var mappedExplanation = {
                    text: ko.observable(explanation.text),
                    isEditing: ko.observable(false),
                    id: explanation.id
                };
                (function (item) {
                    var saveIntervalId = null;
                    item.text.subscribe(function (changedText) {
                        if (explanation.id != _.last(explanations()).id)
                            return;

                        canAddExplanation(changedText.length != 0);
                    });
                    item.isEditing.subscribe(function (value) {
                        if (value) {
                            saveIntervalId = setInterval(function () {
                                saveExplanation(item.id, item.text());
                            }, 60000);
                        } else {
                            if (!_.isNull(saveIntervalId)) {
                                clearInterval(saveIntervalId);
                                saveIntervalId = null;
                            }
                        }
                    });

                })(mappedExplanation);
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
            saveExplanation = function (id, text) {
                if (_.isEmptyOrWhitespace(text))
                    return;

                var contextExplanation = _.find(question().explanations, function (obj) {
                    return obj.id == id;
                });

                if (_.isObject(contextExplanation)) {
                    contextExplanation.text = text;
                }
                else {
                    question().explanations.push(
                        {
                            id: id,
                            text: text
                        });
                }

                notification.update();
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
            goToRelatedObjective: goToRelatedObjective,
            goToPreviousQuestion: goToPreviousQuestion,
            goToNextQuestion: goToNextQuestion,
            isAnswersBlockExpanded: isAnswersBlockExpanded,
            isExplanationsBlockExpanded: isExplanationsBlockExpanded,

            notification: notification,

            toggleAnswers: toggleAnswers,
            toggleExplanations: toggleExplanations,

            canAddExplanation: canAddExplanation,
            addExplanation: addExplanation,
            editExplanation: editExplanation,
            endEditExplanation: endEditExplanation,
            deleteExplanation: deleteExplanation,

            addAnswerOption: addAnswerOption,
            toggleAnswerCorrectness: toggleAnswerCorrectness,
            saveAnswerOption: saveAnswerOption,
            updateAnswerOptionText: updateAnswerOptionText,
            deleteAnswerOption: deleteAnswerOption,

            language: currentLanguage,
            eventTracker: eventTracker
        };
    }
);