define(['dataContext', 'constants', 'eventTracker', 'localization/localizationManager', 'plugins/router', 'repositories/objectiveRepository', 'repositories/experienceRepository', 'repositories/questionRepository', 'notify', 'clientContext'],
    function (dataContext, constants, eventTracker, localizationManager, router, repository, experienceRepository, questionRepository, notify, clientContext) {
        "use strict";

        var
            events = {
                updateObjectiveTitle: "Update objective title",
                navigateToEditQuestion: "Navigate to edit question",
                navigateToCreateQuestion: "Navigate to create question",
                selectQuestion: "Select question",
                unselectQuestion: "Unselect question",
                deleteSelectedQuestions: "Delete question"
            };

        var
            objectiveId = null,
            title = ko.observable(''),
            currentLanguage = '';

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

                    eventTracker.publish(events.updateObjectiveTitle);

                    if (title.isValid()) {
                        repository.updateObjective({ id: that.objectiveId, title: that.title() }).then(showNotification);
                    } else {
                        title(objectiveTitle);
                    }
                });
            },

            questions = ko.observableArray([]),

            navigateToEditQuestion = function (question) {
                eventTracker.publish(events.navigateToEditQuestion);
                if (_.isNullOrUndefined(question)) {
                    throw 'Question is null or undefined';
                }

                if (_.isNullOrUndefined(question.id)) {
                    throw 'Question id is null or undefined';
                }

                router.navigateWithQueryString('objective/' + this.objectiveId + '/question/' + question.id);
            },

            navigateToCreateQuestion = function () {
                eventTracker.publish(events.navigateToCreateQuestion);
                router.navigateWithQueryString('objective/' + this.objectiveId + '/question/create');
            },

            deleteSelectedQuestions = function () {
                eventTracker.publish(events.deleteSelectedQuestions);
                var selectedQuestions = getSelectedQuestions();
                if (selectedQuestions.length == 0)
                    throw 'No selected questions to delete';

                var that = this;

                var questionIds = _.map(selectedQuestions, function (item) {
                    return item.id;
                });

                questionRepository.removeQuestions(this.objectiveId, questionIds).then(function (modifiedOn) {
                    that.questions(_.difference(that.questions(), selectedQuestions));
                    showNotification(modifiedOn);
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
                eventTracker.publish(question.isSelected() ? events.selectQuestion : events.unselectQuestion);
            },

            mapQuestion = function (item) {
                var mappedQuestion = {
                    id: item.id,
                    title: item.title,
                    modifiedOn: item.modifiedOn,
                    isSelected: ko.observable(false)
                };

                return mappedQuestion;
            },

            activate = function (objId) {
                var that = this;
                this.currentLanguage = localizationManager.currentLanguage;

                return repository.getById(objId).then(function (objective) {
                    clientContext.set('lastVisitedObjective', objId);
                    that.objectiveId = objective.id;
                    that.title(objective.title);

                    var array = _.chain(objective.questions).map(function (item) {
                        return mapQuestion(item);
                    }).sortBy(function (question) {
                        return question.title.toLowerCase();
                    }).value();

                    that.questions(array);
                }).fail(function (reason) {
                    router.replace('404');
                    return;
                });
            },

            getSelectedQuestions = function () {
                return _.reject(questions(), function (item) {
                    return !item.isSelected();
                });
            },

            enableDeleteQuestions = ko.computed(function () {
                return getSelectedQuestions().length > 0;
            }),

            showNotification = function (date) {
                notify.info(localizationManager.localize('savedAt') + ' ' + date.toLocaleTimeString());
            };

        return {
            objectiveId: objectiveId,
            title: title,
            titleMaxLength: constants.validation.objectiveTitleMaxLength,
            currentLanguage: currentLanguage,

            questions: questions,
            enableDeleteQuestions: enableDeleteQuestions,

            startEditTitle: startEditTitle,
            endEditTitle: endEditTitle,

            navigateToEditQuestion: navigateToEditQuestion,
            navigateToCreateQuestion: navigateToCreateQuestion,

            deleteSelectedQuestions: deleteSelectedQuestions,
            toggleQuestionSelection: toggleQuestionSelection,

            activate: activate,
        };
    }
);