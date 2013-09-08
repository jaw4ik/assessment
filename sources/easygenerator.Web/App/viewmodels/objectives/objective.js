define(['dataContext', 'constants', 'eventTracker', 'localization/localizationManager', 'plugins/router', 'repositories/objectiveRepository', 'notify'],
    function (dataContext, constants, eventTracker, localizationManager, router, repository, notify) {
        "use strict";

        var events = {
            category: 'Learning Objective',
            updateObjectiveTitle: "Update objective title",
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
            createdOn = null,
            modifiedOn = ko.observable(),
            titleMaxLength = 255,

            title = ko.observable('').extend({
                required: true,
                maxLength: titleMaxLength
            }),
            language = ko.observable();

        title.isEditing = ko.observable();

        var
            startEditTitle = function () {
                title.isEditing(true);
            },

            endEditTitle = function () {
                title(title().trim());
                title.isEditing(false);

                var objectiveTitle = null;
                var that = this;
                repository.getById(that.objectiveId).then(function (response) {
                    objectiveTitle = response.title;
                    if (title() == objectiveTitle)
                        return;

                    sendEvent(events.updateObjectiveTitle);

                    if (title.isValid()) {
                        repository.updateObjective({ id: that.objectiveId, title: that.title() }).then(function (objective) {
                            modifiedOn(objective.modifiedOn);
                            notify.info(localizationManager.localize('lastSaving') + ': ' + new Date().toLocaleTimeString());
                        });
                    } else {
                        title(objectiveTitle);
                    }
                });
            },

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
                    router.replace('404');
                } else {
                    router.navigate('objective/' + this.nextObjectiveId);
                }
            },

            navigateToPreviousObjective = function () {
                sendEvent(events.navigateToPreviousObjective);
                if (_.isNullOrUndefined(this.previousObjectiveId)) {
                    router.replace('404');
                } else {
                    router.navigate('objective/' + this.previousObjectiveId);
                }
            },

            deleteSelectedQuestions = function () {
                sendEvent(events.deleteSelectedQuestions);
                var selectedQuestions = getSelectedQuestions();
                if (selectedQuestions.length == 0)
                    throw 'No selected questions to delete';

                repository.getById(this.objectiveId).then(function (objective) {
                    _.each(selectedQuestions, function (question) {
                        objective.questions = _.reject(objective.questions, function (item) {
                            return item.id === question.id;
                        });
                    });

                    return repository.updateObjective(objective).then(function (updatedObjective) {
                        _.each(selectedQuestions, function (question) {
                            questions.remove(question);
                        });

                        modifiedOn(updatedObjective.modifiedOn);
                        notify.info(localizationManager.localize('lastSaving') + ': ' + new Date().toLocaleTimeString());
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
                    router.replace('400');
                    return undefined;
                }
                this.language(localizationManager.currentLanguage);
                var that = this;

                return repository.getCollection().then(
                    function (response) {
                        var objectives = _.sortBy(response, function (item) {
                            return item.title.toLowerCase();
                        });

                        var objective = _.find(objectives, function (item) {
                            return item.id === objId;
                        });

                        if (!_.isObject(objective)) {
                            router.replace('404');
                            return;
                        }

                        that.objectiveId = objId;
                        that.title(objective.title);
                        that.createdOn = objective.createdOn;
                        that.modifiedOn(objective.modifiedOn);
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
            titleMaxLength: titleMaxLength,
            language: language,
            createdOn: createdOn,
            modifiedOn: modifiedOn,

            image: image,
            questions: questions,
            canDeleteQuestions: canDeleteQuestions,

            startEditTitle: startEditTitle,
            endEditTitle: endEditTitle,

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