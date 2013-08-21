﻿define(['dataContext', 'plugins/router', 'eventTracker', 'models/answerOption', 'models/explanation', 'localization/localizationManager', 'constants', 'repositories/questionRepository'],
    function (dataContext, router, eventTracker, answerOptionModel, expalantionModel, localizationManager, constants, questionRepository) {
        "use strict";
        var
            events = {
                category: 'Question',
                navigateToRelatedObjective: 'Navigate to related objective',
                navigateToNextQuestion: 'Navigate to next question',
                navigateToPreviousQuestion: 'Navigate to previous question',
                updateQuestionTitle: 'Update question title',

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

        var self = {};
        self.objectiveId = '';
        self.questionId = '';
        self.previousId = '';
        self.nextId = '';

        var
            objectiveTitle = '',
            questionTitleMaxLength = 255,
            answerOptions = ko.observableArray([]),
            explanations = ko.observableArray([]),
            hasPrevious = false,
            hasNext = false,
            currentLanguage = ko.observable(''),
            lastAddedExplanation = ko.observable(null),
            isAnswersBlockExpanded = ko.observable(true),
            isExplanationsBlockExpanded = ko.observable(true),
            title = ko.observable('').extend({
                required: true,
                maxLength: questionTitleMaxLength
            });
        
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
            router.navigate('objective/' + self.objectiveId);
        },

        goToPreviousQuestion = function () {
            if (!this.hasPrevious)
                router.navigate('404');

            sendEvent(events.navigateToPreviousQuestion);
            router.navigate('objective/' + self.objectiveId + '/question/' + self.previousId);
        },

        goToNextQuestion = function () {
            if (!this.hasNext)
                router.navigate('404');

            sendEvent(events.navigateToNextQuestion);
            router.navigate('objective/' + self.objectiveId + '/question/' + self.nextId);
        },

        getQuestionFromDataContext = function (objectiveId, questionId) {
            var objective = _.find(dataContext.objectives, function (item) {
                return item.id == objectiveId;
            });

            return _.find(objective.questions, function (item) {
                return item.id == questionId;
            });
        },

        startEditQuestionTitle = function () {
            this.title.isEditing(true);
        },

        endEditQuestionTitle = function () {
            sendEvent(events.updateQuestionTitle);
            this.title.isEditing(false);
            var that = this;
            if (that.title.isValid()) {
                questionRepository.update(self.objectiveId, { id: self.questionId, title: ko.unwrap(that.title) }).then(
                    function () {
                        notification.update();
                    });
            } else {
              questionRepository.getById(self.objectiveId, self.questionId).then(
                    function (response) {
                        that.title(response.title);
                    });
            }
        },

        //#endregion Question

        //#region Answer options

        toggleAnswers = function () {
            isAnswersBlockExpanded(!isAnswersBlockExpanded());
        },

        addAnswerOption = function () {
            sendEvent(events.addAnswerOption);

            var question = getQuestionFromDataContext(self.objectiveId, self.questionId);

            addAnswer(success);

            //TODO: temporary method. Would be changed, when dataContext will be reconstructed

            function addAnswer(callback) {
                var newAnswer = new answerOptionModel({
                    id: generateNewEntryId(question.answerOptions),
                    text: '',
                    isCorrect: false
                });

                question.answerOptions.push(newAnswer);

                if (_.isFunction(callback))
                    callback(newAnswer);
            }

            function success(newInstance) {
                var observableAnswer = mapAnswerOption(newInstance);
                observableAnswer.isInEdit(true);

                answerOptions.push(observableAnswer);
            }
        },

        toggleAnswerCorrectness = function (answer) {
            sendEvent(events.toggleAnswerCorrectness);

            var currentAnswer = _.find(getQuestionFromDataContext(self.objectiveId, self.questionId).answerOptions, function (obj) {
                return obj.id == answer.id;
            });

            if (_.isObject(currentAnswer)) {
                var newValue = !currentAnswer.isCorrect;
                currentAnswer.isCorrect = newValue;

                answer.isCorrect(newValue);
                notification.update();
            }
        },

        saveAnswerOption = function (answer) {
            sendEvent(events.saveAnswerOption);

            var question = getQuestionFromDataContext(self.objectiveId, self.questionId);

            var currentAnswer = _.find(question.answerOptions, function (obj) {
                return obj.id == answer.id;
            });

            if (_.isObject(currentAnswer) && currentAnswer.text !== answer.text()) {
                currentAnswer.text = answer.text();

                notification.update();
            }
        },

        deleteAnswerOption = function (instance) {
            sendEvent(events.deleteAnswerOption);

            var question = getQuestionFromDataContext(self.objectiveId, self.questionId);

            deleteAnswer(instance, success);

            //TODO: temporary method. Would be changed, when dataContext will be reconstructed

            function deleteAnswer(answer, callback) {
                question.answerOptions = _.reject(question.answerOptions, function (item) {
                    return item.id == answer.id;
                });

                if (_.isFunction(callback))
                    callback(answer);
            }

            function success(answer) {
                answerOptions.remove(answer);
                notification.update();
            }
        },

        mapAnswerOption = function (answer) {
            var mappedItem = {
                id: answer.id,
                text: ko.observable(answer.text || ''),
                isCorrect: ko.observable(answer.isCorrect || false),
                correctnessTooltip: function () {
                    return localizationManager.localize(this.isCorrect() ? 'correctAnswer' : 'incorrectAnswer');
                },
                isInEdit: ko.observable(false),
                isEmpty: ko.observable(_.isEmptyOrWhitespace(answer.text))
            };

            mappedItem.text.subscribe(function (value) {
                mappedItem.isEmpty(_.isEmptyOrWhitespace(value));
            });

            var saveIntervalId = null;
            mappedItem.isInEdit.subscribe(function (value) {

                if (value) {
                    sendEvent(events.startEditingAnswerOption);

                    saveIntervalId = setInterval(function () {
                        saveAnswerOption(mappedItem);
                    }, constants.autosaveTimersInterval.answerOption);
                    return;
                } else if (_.isEmptyOrWhitespace(mappedItem.text())) {
                    deleteAnswerOption(mappedItem);
                } else {
                    saveAnswerOption(mappedItem);
                }

                sendEvent(events.endEditingAnswerOption);
                clearInterval(saveIntervalId);
            });

            return mappedItem;
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
                id: generateNewEntryId(explanations()),
                text: ''
            }));

            explanation.isEditing(true);

            lastAddedExplanation(explanation);
            explanations.push(explanation);
            sendEvent(events.addExplanation);
        },

        deleteExplanation = function (explanation) {
            sendEvent(events.deleteExplanation);
            var question = getQuestionFromDataContext(self.objectiveId, self.questionId);

            if (!!lastAddedExplanation() && explanation.id == lastAddedExplanation().id) {
                lastAddedExplanation(null);
            }

            explanations(_.reject(explanations(), function (item) {
                return item.id == explanation.id;
            }));

            question.explanations = _.reject(question.explanations, function (item) {
                return item.id == explanation.id;
            });

            removeSubscribersFromExplanation(explanation);
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
            if (!explanation.isEditing() && !!lastAddedExplanation() && explanation.id == lastAddedExplanation().id)
                lastAddedExplanation(null);

            var question = getQuestionFromDataContext(self.objectiveId, self.questionId);

            if (_.isEmptyOrWhitespace(explanation.text())) {
                if (!explanation.isEditing()) {
                    removeSubscribersFromExplanation(explanation);

                    explanations.remove(explanation);
                    question.explanations = _.reject(question.explanations, function (item) {
                        return item.id == explanation.id;
                    });
                }
                return;
            }

            var contextExplanation = _.find(question.explanations, function (obj) {
                return obj.id == explanation.id;
            });

            if (_.isObject(contextExplanation)) {
                contextExplanation.text = explanation.text();
            }
            else {
                question.explanations.push(
                    {
                        id: explanation.id,
                        text: explanation.text()
                    });
            }

            notification.update();
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
            } else
                return true;
        }),

        removeSubscribersFromExplanation = function (explanation) {
            if (!!explanation.editingSubscription)
                explanation.editingSubscription.dispose();
        },

        //#endregion Explanations

        activate = function (objId, quesId) {
            if (!_.isString(objId) || !_.isString(quesId)) {
                router.navigate('400');
                return;
            }

            var objective = _.find(dataContext.objectives, function (item) {
                return item.id == objId;
            });

            if (!_.isObject(objective)) {
                router.navigate('404');
                return;
            }

            var question = _.find(objective.questions, function (item) {
                return item.id == quesId;
            });

            if (!_.isObject(question)) {
                router.navigate('404');
                return;
            }

            var that = this;

            self.objectiveId = objective.id;
            self.questionId = question.id;

            this.title(question.title);
            this.objectiveTitle = objective.title;

            var mappedAnswerOptions = _.map(question.answerOptions, function(item) {
                return mapAnswerOption.call(that, item);
            });
            this.answerOptions(mappedAnswerOptions);

            var mappedExplanations = _.map(question.explanations, function(item) {
                return mapExplanation.call(that, item);
            });
            this.explanations(mappedExplanations);

            var questionIndex = objective.questions.indexOf(question);
            self.nextId = (objective.questions.length > questionIndex + 1) ? objective.questions[questionIndex + 1].id : null;
            self.previousId = (questionIndex != 0) ? objective.questions[questionIndex - 1].id : null;

            this.hasNext = self.nextId != null;
            this.hasPrevious = self.previousId != null;

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
            //#region Properties
            objectiveTitle: objectiveTitle,
            title: title,
            questionTitleMaxLength: questionTitleMaxLength,
            answerOptions: answerOptions,
            explanations: explanations,
            hasPrevious: hasPrevious,
            hasNext: hasNext,
            language: currentLanguage,
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