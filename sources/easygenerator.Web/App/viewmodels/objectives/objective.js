define(['dataContext', 'constants', 'eventTracker', 'plugins/router', 'repositories/objectiveRepository'],
    function (dataContext, constants, eventTracker, router, repository) {
        "use strict";

        var events = {
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
                router.navigate('objectives');
            },
            navigateToEditQuestion = function (question) {
                sendEvent(events.navigateToEditQuestion);
                if (_.isNullOrUndefined(question)) {
                    throw 'Question is null or undefined';
                }

                if (_.isNullOrUndefined(question.id)) {
                    throw 'Question id is null or undefined';
                }

                router.navigate('objective/' + this.objectiveId + '/question/' + question.id);
            },
            navigateToCreateQuestion = function () {
                sendEvent(events.navigateToCreateQuestion);
                router.navigate('objective/' + this.objectiveId + '/question/create');
            },
            navigateToNextObjective = function () {
                sendEvent(events.navigateToNextObjective);
                if (_.isNullOrUndefined(this.nextObjectiveId)) {
                    router.navigate('404');
                } else {
                    router.navigate('objective/' + this.nextObjectiveId);
                }
            },
            navigateToPreviousObjective = function () {
                sendEvent(events.navigateToPreviousObjective);
                if (_.isNullOrUndefined(this.previousObjectiveId)) {
                    router.navigate('404');
                } else {
                    router.navigate('objective/' + this.previousObjectiveId);
                }
            },
            //todo: refactor delete functionality
            deleteSelectedQuestions = function () {
                sendEvent(events.deleteSelectedQuestions);
                var selectedQuestions = getSelectedQuestions();
                if (selectedQuestions.length == 0)
                    throw 'No selected questions to delete';

                return repository.getById(this.objectiveId).then(function (objective) {
                    _.each(selectedQuestions, function (question) {
                        objective.questions = _.reject(objective.questions, function (item) {
                            return item.id == question.id;
                        });
                    });

                    return repository.update(objective).then(function (success) {
                        if (success) {
                            _.each(selectedQuestions, function (question) {
                                questions.remove(question);
                            });
                        }
                    });
                });
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
            activate = function (objId) {
                if (!_.isString(objId)) {
                    router.navigate('400');
                    return undefined;
                }

                var that = this;
                return repository.getCollection().then(
                    function (response) {
                        var objectives = _.sortBy(response, function (item) {
                            return item.title.toLowerCase();
                        });

                        var objective = _.find(objectives, function (item) {
                            return item.id == objId;
                        });

                        if (!_.isObject(objective)) {
                            router.navigate('404');
                            return;
                        }

                        that.objectiveId = objId;
                        that.title = objective.title;
                        that.image(objective.image);

                        var index = _.indexOf(objectives, objective);
                        that.previousObjectiveId = index != 0 ? objectives[index - 1].id : null;
                        that.nextObjectiveId = index != objectives.length - 1 ? objectives[index + 1].id : null;

                        var array = _.chain(objective.questions)
                            .map(function (item) {
                                return mapQuestion(item);
                            })
                            .sortBy(function (question) { return question.title.toLowerCase(); })
                            .value();

                        that.questions(currentSortingOption() == constants.sortingOptions.byTitleAsc ? array : array.reverse());
                    });
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