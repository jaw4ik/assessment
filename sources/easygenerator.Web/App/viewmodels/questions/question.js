define(['dataContext', 'durandal/plugins/router', 'eventTracker', 'models/answerOption'],
    function (dataContext, router, eventTracker, AnswerOptionModel) {
        "use strict";
        var
            events = {
                category: 'Question',
                navigateToRelatedObjective: 'Navigate to related objective',
                navigateToNextQuestion: 'Navigate to next question',
                navigateToPreviousQuestion: 'Navigate to previous question',
                addAnswerOption: 'Add answer option',
                toggleAnswerCorrectness: 'Correct/incorrect answer option',
                saveAnswerOption: 'Save the answer option text',
                deleteAnswerOption: 'Delete answer option'
            },

            sendEvent = function (eventName) {
                eventTracker.publish(eventName, events.category);
            };

        var objectiveId = '',
            question = ko.observable({}),
            objectiveTitle = '',
            title = '',
            answerOptions = ko.observableArray([]),
            explanations = [],
            hasPrevious = false,
            hasNext = false,
            previousId = '',
            nextId = '',
            isAnswersBlockExpanded = ko.observable(true),
            isExplanationsBlockExpanded = ko.observable(true),

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
                    var newAnswer = new AnswerOptionModel({
                        id: getUniqueId(answerOptions()),
                        text: '',
                        isCorrect: false
                    });

                    function getUniqueId(answersArray) {
                        var ids = _.map(answersArray, function (answer) {
                            return answer.id;
                        });
                        return _.max(ids) + 1;
                    }

                    question().answerOptions.push(newAnswer);

                    var observableAnswer = {
                        id: newAnswer.id,
                        text: ko.observable(newAnswer.text),
                        isCorrect: ko.observable(newAnswer.isCorrect),
                        isInEdit: ko.observable(false)
                    };

                    callback(observableAnswer);
                }

                function success(answer) {
                    answerOptions.push(answer);
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

                        callback(newValue);
                    }
                }

                function success(value) {
                    instance.isCorrect(value);
                }
            },

            saveAnswerOption = function (instance, context) {
                sendEvent(events.saveAnswer);

                save(instance, context.target.innerHTML);

                //TODO: temporary method. Would be changed, when dataContext will be reconstructed
                function save(answer, value) {
                    var currentAnswer = _.find(question().answerOptions, function (obj) {
                        return obj.id == answer.id;
                    });
                    if (_.isObject(currentAnswer)) {
                        currentAnswer.text = value;
                    }
                }
            },

            deleteAnswerOption = function (instance) {
                sendEvent(events.deleteAnswerOption);

                deleteAnswer(instance, success);

                //TODO: temporary method. Would be changed, when dataContext will be reconstructed
                function deleteAnswer(answer, callback) {
                    question().answerOptions = _.filter(question().answerOptions, function (obj) {
                        return obj.id != answer.id;
                    });

                    callback(answer);
                }

                function success(answer) {
                    answerOptions.remove(answer);
                }
            },

            editExplanation = function (explanation) {
                explanation.isEditing(true);
            },
            
            saveExplanation = function (explanation) {
                if (explanation.text.isValid())
                    explanation.isEditing(false);
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

                this.answerOptions(_.map(this.question().answerOptions, function (answer) {
                    return {
                        id: answer.id,
                        text: ko.observable(answer.text || ''),
                        isCorrect: ko.observable(answer.isCorrect || false)
                    };
                }));

                this.explanations = _.map(this.question().explanations, function (explanation) {
                    return {
                        text: ko.observable(explanation).extend({
                            required: { message: 'Please, provide text for expanation' }
                        }),
                        isEditing: ko.observable(false)
                    };
                });

                var questionIndex = objective.questions.indexOf(question());
                this.nextId = (objective.questions.length > questionIndex + 1) ? objective.questions[questionIndex + 1].id : null;
                this.previousId = (questionIndex != 0) ? objective.questions[questionIndex - 1].id : null;

                this.hasNext = this.nextId != null;
                this.hasPrevious = this.previousId != null;
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
            toggleAnswers: toggleAnswers,
            toggleExplanations: toggleExplanations,
            editExplanation: editExplanation,
            saveExplanation: saveExplanation,

            addAnswerOption: addAnswerOption,
            toggleAnswerCorrectness: toggleAnswerCorrectness,
            saveAnswerOption: saveAnswerOption,
            deleteAnswerOption: deleteAnswerOption
        };
    }
);