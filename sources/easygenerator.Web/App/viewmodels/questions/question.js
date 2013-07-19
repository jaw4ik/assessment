define(['dataContext', 'durandal/plugins/router', 'eventTracker', 'models/answerOption', 'models/explanation', 'localization/localizationManager'],
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
                deleteExplanation: 'Delete explanation'
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
            isAnswersBlockExpanded = ko.observable(true),
            isExplanationsBlockExpanded = ko.observable(true),
            
            notification = {
                text: ko.observable(''),
                visibility: ko.observable(false),
                close: function() { notification.visibility(false); },
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

                    if (_.isFunction(success))
                        callback(newAnswer);
                }

                function success(answer) {
                    var observableAnswer = mapAnswerOption(answer);
                    
                    answerOptions.push(observableAnswer);
                    notification.update();
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

                        if (_.isFunction(success))
                            callback(newValue);
                    }
                }

                function success(value) {
                    instance.isCorrect(value);
                    notification.update();
                }
            },
            editAnswerOption = function (instance) {
                instance.isInEdit(true);
            },
            saveAnswerOption = function (instance, context) {
                sendEvent(events.saveAnswerOption);

                instance.isInEdit(false);

                if (_.isEmptyOrWhitespace(context.target.textContent)) {
                    deleteAnswerOption(instance);
                    return;
                }

                save(instance, context.target.innerHTML, success);

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
            deleteAnswerOption = function (instance) {
                sendEvent(events.deleteAnswerOption);

                deleteAnswer(instance, success);

                //TODO: temporary method. Would be changed, when dataContext will be reconstructed

                function deleteAnswer(answer, callback) {
                    question().answerOptions = _.reject(question().answerOptions, function (item) {
                        return item.id == answer.id;
                    });

                    if (_.isFunction(success))
                        callback(answer);
                }

                function success(answer) {
                    answerOptions.remove(answer);
                    notification.update();
                }
            },
            addExplanation = function () {
                sendEvent(events.addExplanation);
                var explanation = mapExplanation(new expalantionModel({
                    id: this.explanations().length,
                    text: ''
                }));

                explanation.isEditing(true);

                this.explanations.push(explanation);
            },
            editExplanation = function (explanation) {
                explanation.isEditing(true);
            },
            endEditExplanation = function (explanation) {
                if (_.isEmptyOrWhitespace(explanation.text())) {
                    this.explanations.remove(explanation);
                    return;
                }

                var contextExplanation = _.find(question().explanations, function (obj) {
                    return obj.id == explanation.id;
                });

                if (_.isObject(contextExplanation)) {
                    contextExplanation.text = explanation.text();
                }

                explanation.isEditing(false);
            },
            deleteExplanation = function (explanation) {
                sendEvent(events.deleteExplanation);
                this.question().explanations = _.reject(this.question().explanations, function (item) {
                    return item.id == explanation.id;
                });

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
            },
            mapAnswerOption = function (answer) {
                return {
                    id: answer.id,
                    text: answer.text || '',
                    isCorrect: ko.observable(answer.isCorrect || false),
                    isInEdit: ko.observable(false)
                };
            },
            mapExplanation = function (explanation) {
                return {
                    text: ko.observable(explanation.text),
                    isEditing: ko.observable(false),
                    id: explanation.id
                };
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

            addExplanation: addExplanation,
            editExplanation: editExplanation,
            endEditExplanation: endEditExplanation,
            deleteExplanation: deleteExplanation,

            addAnswerOption: addAnswerOption,
            toggleAnswerCorrectness: toggleAnswerCorrectness,
            editAnswerOption: editAnswerOption,
            saveAnswerOption: saveAnswerOption,
            deleteAnswerOption: deleteAnswerOption,

            language: currentLanguage
        };
    }
);