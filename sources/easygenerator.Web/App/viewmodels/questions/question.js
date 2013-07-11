define(['dataContext', 'durandal/plugins/router', 'eventTracker'],
    function (dataContext, router, eventTracker) {
        "use strict";

        var
            events = {
                category: 'Question',
                navigateToRelatedObjective: 'Navigate to related objective',
                navigateToNextQuestion: 'Navigate to next question',
                navigateToPreviousQuestion: 'Navigate to previous question'
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
            activate = function (routeData) {
                if (_.isEmpty(routeData) || _.isEmpty(routeData.objectiveId) || _.isEmpty(routeData.id)) {
                    router.navigateTo('400');
                    return;
                }

                objective = _.find(dataContext.objectives, function (item) {
                    return item.id == routeData.objectiveId;
                });

                if (!_.isObject(objective)) {
                    router.navigateTo('404');
                    return;
                }

                var question = _.find(objective.questions, function (item) {
                    return item.id == routeData.id;
                });

                if (!_.isObject(question)) {
                    router.navigateTo('404');
                    return;
                }

                this.title = question.title;
                this.objectiveTitle = objective.title;
                this.answerOptions = question.answerOptions || [];
                this.explanations = question.explanations || [];

                var indexOfQuestion = objective.questions.indexOf(question);
                this.nextId = (objective.questions.length > indexOfQuestion + 1) ? objective.questions[indexOfQuestion + 1].id : null;
                this.previousId = (indexOfQuestion != 0) ? objective.questions[indexOfQuestion - 1].id : null;

                this.hasNext = this.nextId != null;
                this.hasPrevious = this.previousId != null;
            },
            goToRelatedObjective = function () {
                sendEvent(events.navigateToRelatedObjective);
                router.navigateTo('#/objective/' + objective.id);
            },
            goToPreviousQuestion = function () {
                sendEvent(events.navigateToPreviousQuestion);
                router.navigateTo('#/objective/' + objective.id + '/question/' + this.previousId);
            },
            goToNextQuestion = function () {
                sendEvent(events.navigateToNextQuestion);
                router.navigateTo('#/objective/' + objective.id + '/question/' + this.nextId);
            },
            toggleAnswersBlockSize = function () {
                isAnswersBlockExpanded(!isAnswersBlockExpanded());
            },
            toggleExplanationsBlockSize = function () {
                isExplanationsBlockExpanded(!isExplanationsBlockExpanded());
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
            toggleAnswersBlockSize: toggleAnswersBlockSize,
            toggleExplanationsBlockSize: toggleExplanationsBlockSize
        };
    }
);