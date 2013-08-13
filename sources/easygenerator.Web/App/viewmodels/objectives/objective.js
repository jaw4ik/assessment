define(['dataContext', 'constants', 'eventTracker', 'durandal/plugins/router'],
    function (dataContext, constants, eventTracker, router) {
        "use strict";

        var
            events = {
                category: 'Learning Objective',
                navigateToEdit: "Navigate to edit question",
                navigateToObjectives: "Navigate to Learning Objectives",
                sortByTitleAsc: "Sort questions by title ascending",
                sortByTitleDesc: "Sort questions by title descending",
                selectQuestion: "Select question",
                unselectQuestion: "Unselect question",
                //addQuestion: "Add question",
                //editQuestionTitle: "Edit question title",
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
            sortByTitleAsc = function() {
                sendEvent(events.sortByTitleAsc);
                currentSortingOption(constants.sortingOptions.byTitleAsc);
                questions(_.sortBy(questions(), function(question) { return question.title.toLowerCase(); }));
            },
            sortByTitleDesc = function() {
                sendEvent(events.sortByTitleDesc);
                currentSortingOption(constants.sortingOptions.byTitleDesc);
                questions(_.sortBy(questions(), function(question) { return question.title.toLowerCase(); }).reverse());
            },
            navigateToObjectives = function() {
                sendEvent(events.navigateToObjectives);
                router.navigateTo('#/objectives');
            },
            navigateToEdit = function (item) {
                sendEvent(events.navigateToEdit);
                router.navigateTo('#/objective/' + this.objectiveId + '/question/' + item.id);
            },
            navigateToNextObjective = function() {
                sendEvent(events.navigateToNextObjective);
                if (_.isNullOrUndefined(this.nextObjectiveId)) {
                    router.navigateTo('#/404');
                } else {
                    router.navigateTo('#/objective/' + this.nextObjectiveId);
                }
            },
            navigateToPreviousObjective = function() {
                sendEvent(events.navigateToPreviousObjective);
                if (_.isNullOrUndefined(this.previousObjectiveId)) {
                    router.navigateTo('#/404');
                } else {
                    router.navigateTo('#/objective/' + this.previousObjectiveId);
                }
            },
            //addQuestion = function () {
            //    var model = {
            //        id: generateNewEntryId(questions()),
            //        title: ''
            //    };

            //    var question = mapQuestion(model);
            //    question.isEditing(true);
            //    questions.push(question);
            //    sendEvent(events.addQuestion);
            //},
            deleteSelectedQuestions = function() {
                var that = this;
                _.each(getSelectedQuestions(), function(question) {
                    var objective = _.find(dataContext.objectives, function(e) {
                        return e.id == that.objectiveId;
                    });

                    objective.questions = _.reject(objective.questions, function(item) {
                        return item.id == question.id;
                    });

                    questions.remove(question);
                    //removeSubscribersFromQuestion(question);
                });
                sendEvent(events.deleteSelectedQuestions);
            },
            //endEditQuestionTitle = function (instance) {
            //    debugger;
            //    var that = this;
            //    saveQuestionTitle(instance)(that);
            //    instance.isEditing(false);
            //},
            //saveQuestionTitle = function (instance) {
            //    if (!instance.title.isValid()) {
            //        instance.title.isModified(true);
            //        return;
            //    }

            //    var objective = _.find(dataContext.objectives, function (e) {
            //        return e.id == this.objectiveId;
            //    });

            //    var question = _.find(objective.questions, function (e) {
            //        return e.id == instance.id;
            //    });

            //    if (_.isObject(question)) {
            //        question.title = instance.title();
            //    } else {
            //        objective.questions.push({
            //            id: instance.id,
            //            title: instance.title(),
            //            answerOptions: [],
            //            explanations: []
            //        });
            //    }

            //    sendEvent(events.editQuestionTitle);
            //},
            mapQuestion = function(item) {
                var mappedQuestion = {
                    id: item.id,
                    //title: ko.observable(item.title).extend({
                    //    required: { message: 'Please, provide title for question' },
                    //    maxLength: { message: 'Question title can not be longer than 255 symbols', params: 255 }
                    //}),
                    title: item.title,
                    isSelected: ko.observable(false),
                    //isEditing: ko.observable(false),
                    toggleSelection: function(instance) {
                        instance.isSelected(!instance.isSelected());
                        sendEvent(instance.isSelected() ? events.selectQuestion : events.unselectQuestion);
                    }
                };

                //var saveIntervalId = null;
                //mappedQuestion.isEditing.subscribe(function (value) {
                //    if (value) {
                //        saveIntervalId = setInterval(function () {
                //            saveQuestionTitle(mappedQuestion);
                //        }, constants.autosaveTimersInterval.questionTitle);
                //    } else {
                //        if (!_.isNull(saveIntervalId)) {
                //            clearInterval(saveIntervalId);
                //        }
                //    }
                //});

                return mappedQuestion;
            },
            activate = function(routeData) {
                debugger;
                if (_.isEmpty(routeData) || _.isEmpty(routeData.id)) {
                    router.replaceLocation('#/400');
                    return;
                }

                var objective = _.find(dataContext.objectives, function(item) {
                    return item.id == routeData.id;
                });

                if (!_.isObject(objective)) {
                    router.replaceLocation('#/404');
                    return;
                }

                this.objectiveId = routeData.id;
                this.title = objective.title;
                this.image(objective.image);

                var index = _.indexOf(dataContext.objectives, objective);
                this.previousObjectiveId = index != 0 ? dataContext.objectives[index - 1].id : null;
                this.nextObjectiveId = index != dataContext.objectives.length - 1 ? dataContext.objectives[index + 1].id : null;

                var array = _.chain(objective.questions)
                    .map(function(item) {
                        return mapQuestion(item);
                    })
                    .sortBy(function(question) { return question.title.toLowerCase(); })
                    .value();

                this.questions(currentSortingOption() == constants.sortingOptions.byTitleAsc ? array : array.reverse());
            },
            //deactivate = function() {
            //    _.each(questions(), function(question) {
            //        removeSubscribersFromQuestion(question);
            //    });
            //},
            getSelectedQuestions = function() {
                return _.reject(questions(), function(item) {
                    return !item.isSelected();
                });
            },
            canDeleteQuestions = ko.computed(function() {
                return getSelectedQuestions().length == 1;
            });
            //generateNewEntryId = function (collection) {
            //    var id = 0;
            //    if (collection.length > 0) {
            //        var maxId = _.max(_.map(collection, function (exp) {
            //            return parseInt(exp.id);
            //        }));

            //        id = maxId + 1;
            //    }

            //    return id;
            //},
            //removeSubscribersFromQuestion = function (question) {
            //    if (question.isEditing.getSubscriptionsCount() != 0)
            //        _.each(question.isEditing._subscriptions.change, function (subscription) {
            //            subscription.dispose();
            //        });
            //};

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

            navigateToEdit: navigateToEdit,
            navigateToObjectives: navigateToObjectives,
            navigateToNextObjective: navigateToNextObjective,
            navigateToPreviousObjective: navigateToPreviousObjective,

            //addQuestion: addQuestion,
            deleteSelectedQuestions: deleteSelectedQuestions,
            //endEditQuestionTitle: endEditQuestionTitle,

            activate: activate,
            //deactivate: deactivate
        };
    }
);