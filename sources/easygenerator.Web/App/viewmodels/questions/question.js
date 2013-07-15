define(['dataContext', 'durandal/plugins/router', 'eventTracker'],
    function (dataContext, router, eventTracker) {
        "use strict";
        var
            events = {
                category: 'Question',
                navigateToRelatedObjective: 'Navigate to related objective',
                navigateToNextQuestion: 'Navigate to next question',
                navigateToPreviousQuestion: 'Navigate to previous question',
                toggleAnswers: 'Expand/collapse answer options',
                toggleExplanations: 'Expand/collapse explanations'
            },

            sendEvent = function (eventName) {
                eventTracker.publish(eventName, events.category);
            };

        var objective = null,
            objectiveTitle = '',
            title = '',
            answerOptions = [],
            explanations = [],
            hasPrevious = false,
            hasNext = false,
            previousId = '',
            nextId = '',
            isAnswersBlockExpanded = ko.observable(true),
            isExplanationsBlockExpanded = ko.observable(true),

            goToRelatedObjective = function () {
                sendEvent(events.navigateToRelatedObjective);
                router.navigateTo('#/objective/' + this.objective.id);
            },

            goToPreviousQuestion = function () {
                sendEvent(events.navigateToPreviousQuestion);
                router.navigateTo('#/objective/' + this.objective.id + '/question/' + this.previousId);
            },

            goToNextQuestion = function () {
                sendEvent(events.navigateToNextQuestion);
                router.navigateTo('#/objective/' + this.objective.id + '/question/' + this.nextId);
            },

            toggleAnswers = function () {
                sendEvent(events.toggleAnswers);
                isAnswersBlockExpanded(!isAnswersBlockExpanded());
            },

            toggleExplanations = function () {
                sendEvent(events.toggleExplanations);
                isExplanationsBlockExpanded(!isExplanationsBlockExpanded());
            },

            activate = function (routeData) {
                if (_.isEmpty(routeData) || _.isEmpty(routeData.objectiveId) || _.isEmpty(routeData.id)) {
                    router.navigateTo('400');
                    return;
                }

                this.objective = _.find(dataContext.objectives, function (item) {
                    return item.id == routeData.objectiveId;
                });

                if (!_.isObject(this.objective)) {
                    router.navigateTo('404');
                    return;
                }

                var question = _.find(this.objective.questions, function (item) {
                    return item.id == routeData.id;
                });

                if (!_.isObject(question)) {
                    router.navigateTo('404');
                    return;
                }

                this.title = question.title;
                this.objectiveTitle = this.objective.title;
                this.answerOptions = question.answerOptions || [];
                this.explanations = question.explanations || [];

                var questionIndex = this.objective.questions.indexOf(question);
                this.nextId = (this.objective.questions.length > questionIndex + 1) ? this.objective.questions[questionIndex + 1].id : null;
                this.previousId = (questionIndex != 0) ? this.objective.questions[questionIndex - 1].id : null;

                this.hasNext = this.nextId != null;
                this.hasPrevious = this.previousId != null;
            };


        return {
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
            toggleExplanations: toggleExplanations
        };
    }
);