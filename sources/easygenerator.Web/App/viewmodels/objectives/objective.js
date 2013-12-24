define(['dataContext', 'constants', 'eventTracker', 'localization/localizationManager', 'plugins/router', 'repositories/objectiveRepository', 'repositories/experienceRepository', 'repositories/questionRepository', 'notify', 'uiLocker', 'clientContext'],
    function (dataContext, constants, eventTracker, localizationManager, router, repository, experienceRepository, questionRepository, notify, uiLocker, clientContext) {
        "use strict";

        var
            events = {
                updateObjectiveTitle: "Update objective title",
                navigateToEditQuestion: "Navigate to edit question",
                createNewQuestion: "Create new question",
                selectQuestion: "Select question",
                unselectQuestion: "Unselect question",
                deleteSelectedQuestions: "Delete question",
                navigateToExperience: "Navigate to experience",
                navigateToObjectives: "Navigate to objectives",
            };

        var
            objectiveId = null,
            contextExperienceTitle = null,
            contextExperienceId = null,
            goBackLink = '',
            goBackTooltip = '',
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
            
            createQuestion = function () {
                var that = this;
                eventTracker.publish(events.createNewQuestion);
                uiLocker.lock();
                return Q.fcall(function () {

                    var newQuestion = {
                        title: localizationManager.localize('newQuestionTitle')
                    };

                    return questionRepository.addQuestion(that.objectiveId, newQuestion).then(function (createdQuestion) {
                        clientContext.set('lastCreatedQuestionId', createdQuestion.id);
                        uiLocker.unlock();
                        router.navigateWithQueryString('objective/' + that.objectiveId + '/question/' + createdQuestion.id);
                    }).fail(function() {
                        uiLocker.unlock();
                    });
                });
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

            navigateBack = function () {
                if (_.isNull(this.contextExperienceId)) {
                    eventTracker.publish(events.navigateToObjectives);
                    router.navigate('objectives');
                } else {
                    eventTracker.publish(events.navigateToExperience);
                    router.navigate('experience/' + this.contextExperienceId);
                }
            },

            activate = function (objId, queryParams) {
                var that = this;
                

                
                this.currentLanguage = localizationManager.currentLanguage;

                if (_.isNullOrUndefined(queryParams) || !_.isString(queryParams.experienceId)) {
                    that.contextExperienceId = null;
                    that.contextExperienceTitle = null;
                    that.goBackTooltip = localizationManager.localize('backTo') + ' ' + localizationManager.localize('learningObjectives');
                    that.goBackLink = '#objectives';

                    return initObjectiveInfo(objId);
                }

                return experienceRepository.getById(queryParams.experienceId).then(function (experience) {
                    that.contextExperienceId = experience.id;
                    that.contextExperienceTitle = experience.title;

                    that.goBackTooltip = localizationManager.localize('backTo') + ' \'' + experience.title + '\'';
                    that.goBackLink = '#experience/' + experience.id;

                    return initObjectiveInfo(objId);
                }).fail(function (reason) {
                    router.activeItem.settings.lifecycleData = { redirect: '404' };
                    throw reason;
                });
                
                function initObjectiveInfo(id) {
                    return repository.getById(id).then(function (objective) {
                        clientContext.set('lastVisitedObjective', id);
                        that.objectiveId = objective.id;
                        that.title(objective.title);

                        var array = _.chain(objective.questions).sortBy(function (question) {
                            return -question.createdOn;
                        }).map(function (item) {
                            return mapQuestion(item);
                        }).value();

                        that.questions(array);
                    }).fail(function (reason) {
                        router.activeItem.settings.lifecycleData = { redirect: '404' };
                        throw reason;
                    });
                }
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
                notify.saved();
            };

        return {
            objectiveId: objectiveId,
            title: title,
            titleMaxLength: constants.validation.objectiveTitleMaxLength,
            currentLanguage: currentLanguage,
            contextExperienceId: contextExperienceId,
            contextExperienceTitle: contextExperienceTitle,
            goBackTooltip: goBackTooltip,
            goBackLink: goBackLink,

            questions: questions,
            enableDeleteQuestions: enableDeleteQuestions,

            startEditTitle: startEditTitle,
            endEditTitle: endEditTitle,

            navigateBack: navigateBack,
            navigateToEditQuestion: navigateToEditQuestion,

            createQuestion: createQuestion,
            deleteSelectedQuestions: deleteSelectedQuestions,
            toggleQuestionSelection: toggleQuestionSelection,

            activate: activate
        };
    }
);