define(['dataContext', 'constants', 'eventTracker', 'localization/localizationManager', 'plugins/router', 'repositories/objectiveRepository', 'repositories/experienceRepository', 'repositories/questionRepository', 'notify'],
    function (dataContext, constants, eventTracker, localizationManager, router, repository, experienceRepository, questionRepository, notify) {
        "use strict";

        var events = {
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
            navigateToPreviousObjective: "Navigate to previous objective",
            navigateToExperience: "Navigate to experience"
        },
            sendEvent = function (eventName) {
                eventTracker.publish(eventName);
            };

        var objectiveId = null,
            nextObjectiveId = null,
            previousObjectiveId = null,
            createdOn = null,
            modifiedOn = ko.observable(),
            title = ko.observable(''),
            contextExperienceTitle = null,
            contextExperienceId = null,
            language = ko.observable();

        title.isEditing = ko.observable();
        title.isValid = ko.computed(function () {
            var length = title().trim().length;
            return length > 0 && length <= constants.validation.objectiveTitleMaxLength;
        });

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
                        repository.updateObjective({ id: that.objectiveId, title: that.title() }).then(function (objectiveModificationOn) {
                            modifiedOn(objectiveModificationOn);
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

            navigateBack = function () {
                if (_.isString(this.contextExperienceId)) {
                    sendEvent(events.navigateToExperience);
                    router.navigate('experience/' + this.contextExperienceId);
                } else {
                    sendEvent(events.navigateToObjectives);
                    router.navigate('objectives');
                }
            },

            navigateToEditQuestion = function (question) {
                sendEvent(events.navigateToEditQuestion);
                if (_.isNullOrUndefined(question)) {
                    throw 'Question is null or undefined';
                }

                if (_.isNullOrUndefined(question.id)) {
                    throw 'Question id is null or undefined';
                }

                router.navigateWithQueryString('objective/' + this.objectiveId + '/question/' + question.id);
            },

            navigateToCreateQuestion = function () {
                sendEvent(events.navigateToCreateQuestion);
                router.navigateWithQueryString('objective/' + this.objectiveId + '/question/create');
            },

            navigateToNextObjective = function () {
                sendEvent(events.navigateToNextObjective);
                if (_.isNullOrUndefined(this.nextObjectiveId)) {
                    router.replace('404');
                } else {
                    router.navigateWithQueryString('objective/' + this.nextObjectiveId);
                }
            },

            navigateToPreviousObjective = function () {
                sendEvent(events.navigateToPreviousObjective);
                if (_.isNullOrUndefined(this.previousObjectiveId)) {
                    router.replace('404');
                } else {
                    router.navigateWithQueryString('objective/' + this.previousObjectiveId);
                }
            },

            deleteSelectedQuestions = function () {
                sendEvent(events.deleteSelectedQuestions);
                var selectedQuestions = getSelectedQuestions();
                if (selectedQuestions.length == 0)
                    throw 'No selected questions to delete';

                questionRepository.removeQuestion(this.objectiveId, selectedQuestions[0].id).then(function (objectiveModificationDate) {
                    questions(_.reject(questions(), function (item) { return item.id == selectedQuestions[0].id; }));
                    modifiedOn(objectiveModificationDate);
                    notify.info(localizationManager.localize('lastSaving') + ': ' + new Date().toLocaleTimeString());
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

            activate = function (objId, queryParams) {
                var that = this;

                that.language(localizationManager.currentLanguage);
                if (_.isNullOrUndefined(queryParams) || !_.isString(queryParams.experienceId)) {
                    that.contextExperienceId = null;
                    that.contextExperienceTitle = null;
                    return repository.getCollection().then(function (response) {
                        initializeObjectiveInfo(response);
                    });
                } else {
                    return experienceRepository.getById(queryParams.experienceId).then(function (experience) {
                        if (_.isNull(experience)) {
                            router.replace('404');
                            return;
                        }

                        that.contextExperienceId = queryParams.experienceId;
                        that.contextExperienceTitle = experience.title;
                        initializeObjectiveInfo(experience.objectives);
                    });
                }

                function initializeObjectiveInfo(objectivesList) {
                    var objectives = _.sortBy(objectivesList, function (item) {
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
                };
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
            contextExperienceId: contextExperienceId,
            contextExperienceTitle: contextExperienceTitle,
            titleMaxLength: constants.validation.objectiveTitleMaxLength,
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
            navigateBack: navigateBack,
            navigateToNextObjective: navigateToNextObjective,
            navigateToPreviousObjective: navigateToPreviousObjective,
            navigateToCreateQuestion: navigateToCreateQuestion,

            deleteSelectedQuestions: deleteSelectedQuestions,
            toggleQuestionSelection: toggleQuestionSelection,

            activate: activate,
        };
    }
);