define(['dataContext', 'constants', 'eventTracker', 'durandal/plugins/router'],
    function (dataContext, constants, eventTracker, router) {
        "use strict";

        var
            events = {
                category: 'Learning Objective',
                navigateToEditQuestion: "Navigate to edit question",
                navigateToObjectives: "Navigate to Learning Objectives",
                navigateToCreateQuestion: "Navigate to create question",
                sortByTitleAsc: "Sort questions by title ascending",
                sortByTitleDesc: "Sort questions by title descending",
                selectQuestion: "Select question",
                unselectQuestion: "Unselect question",
                deleteSelectedQuestions: "Delete question",
                navigateToNextObjective: "Navigate to next objective",
                navigateToPreviousObjective: "Navigate to previous objective"
            },
            sendEvent = function (eventName) {
                eventTracker.publish(eventName, events.category);
            };

        var objectiveId = null,
            nextObjectiveId = null,
            previousObjectiveId = null,
            title = null,
            image = ko.observable(),
            questions = ko.observableArray([]),
            currentSortingOption = ko.observable(constants.sortingOptions.byTitleAsc),
            sortByTitleAsc = function () {
                sendEvent(events.sortByTitleAsc);
                currentSortingOption(constants.sortingOptions.byTitleAsc);
                questions(_.sortBy(questions(), function (question) { return question.title.toLowerCase(); }));
            },
            sortByTitleDesc = function () {
                sendEvent(events.sortByTitleDesc);
                currentSortingOption(constants.sortingOptions.byTitleDesc);
                questions(_.sortBy(questions(), function (question) { return question.title.toLowerCase(); }).reverse());
            },
            navigateToObjectives = function () {
                sendEvent(events.navigateToObjectives);
                router.navigateTo('#/objectives');
            },
            navigateToEditQuestion = function (question) {
                sendEvent(events.navigateToEditQuestion);
                if (_.isNullOrUndefined(question)) {
                    throw 'Question is null or undefined';
                }

                if (_.isNullOrUndefined(question.id)) {
                    throw 'Question id is null or undefined';
                }

                router.navigateTo('#/objective/' + this.objectiveId + '/question/' + question.id);
            },
            navigateToCreateQuestion = function () {
                sendEvent(events.navigateToCreateQuestion);
                router.navigateTo('#/objective/' + this.objectiveId + '/question/create');
            },
            navigateToNextObjective = function () {
                sendEvent(events.navigateToNextObjective);
                if (_.isNullOrUndefined(this.nextObjectiveId)) {
                    router.navigateTo('#/404');
                } else {
                    router.navigateTo('#/objective/' + this.nextObjectiveId);
                }
            },
            navigateToPreviousObjective = function () {
                sendEvent(events.navigateToPreviousObjective);
                if (_.isNullOrUndefined(this.previousObjectiveId)) {
                    router.navigateTo('#/404');
                } else {
                    router.navigateTo('#/objective/' + this.previousObjectiveId);
                }
            },
            deleteSelectedQuestions = function () {
                var that = this;
                _.each(getSelectedQuestions(), function (question) {
                    var objective = _.find(dataContext.objectives, function (e) {
                        return e.id == that.objectiveId;
                    });

                    objective.questions = _.reject(objective.questions, function (item) {
                        return item.id == question.id;
                    });

                    questions.remove(question);
                });
                sendEvent(events.deleteSelectedQuestions);
            },
            toggleQuestionSelection = function (question) {
                
                if (_.isNullOrUndefined(question)) {
                    throw 'Question is null or undefined';
                }
                
                if (!ko.isObservable(question.isSelected)) {
                    throw 'Question does not have isSelected observable';
                }

                question.isSelected(!question.isSelected());
                sendEvent(question.isSelected() ? events.selectQuestion : events.unselectQuestion);
            },
            mapQuestion = function (item) {
                var mappedQuestion = {
                    id: item.id,
                    title: item.title,
                    isSelected: ko.observable(false)
                };

                return mappedQuestion;
            },
            activate = function (routeData) {
                if (_.isEmpty(routeData) || _.isEmpty(routeData.id)) {
                    router.navigateTo('#/400');
                    return;
                }

                var objective = _.find(dataContext.objectives, function (item) {
                    return item.id == routeData.id;
                });

                if (!_.isObject(objective)) {
                    router.navigateTo('#/404');
                    return;
                }

                this.objectiveId = routeData.id;
                this.title = objective.title;
                this.image(objective.image);

                var index = _.indexOf(dataContext.objectives, objective);
                this.previousObjectiveId = index != 0 ? dataContext.objectives[index - 1].id : null;
                this.nextObjectiveId = index != dataContext.objectives.length - 1 ? dataContext.objectives[index + 1].id : null;

                var array = _.chain(objective.questions)
                    .map(function (item) {
                        return mapQuestion(item);
                    })
                    .sortBy(function (question) { return question.title.toLowerCase(); })
                    .value();

                this.questions(currentSortingOption() == constants.sortingOptions.byTitleAsc ? array : array.reverse());
            },
            getSelectedQuestions = function () {
                return _.reject(questions(), function (item) {
                    return !item.isSelected();
                });
            },
            canDeleteQuestions = ko.computed(function () {
                return getSelectedQuestions().length == 1;
            });

        return {
            objectiveId: objectiveId,
            nextObjectiveId: nextObjectiveId,
            previousObjectiveId: previousObjectiveId,
            title: title,
            image: image,
            questions: questions,
            canDeleteQuestions: canDeleteQuestions,

            sortByTitleAsc: sortByTitleAsc,
            sortByTitleDesc: sortByTitleDesc,
            currentSortingOption: currentSortingOption,
            sortingOptions: constants.sortingOptions,

            navigateToEditQuestion: navigateToEditQuestion,
            navigateToObjectives: navigateToObjectives,
            navigateToNextObjective: navigateToNextObjective,
            navigateToPreviousObjective: navigateToPreviousObjective,
            navigateToCreateQuestion: navigateToCreateQuestion,

            deleteSelectedQuestions: deleteSelectedQuestions,
            toggleQuestionSelection: toggleQuestionSelection,

            activate: activate,
        };
    }
);