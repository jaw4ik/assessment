﻿define(['viewmodels/questions/answers', 'viewmodels/questions/learningContents', 'plugins/router', 'eventTracker', 'models/answerOption', 'models/learningContent', 'localization/localizationManager', 'constants', 'repositories/questionRepository', 'repositories/objectiveRepository', 'durandal/system', 'notify', 'repositories/answerRepository', 'repositories/learningContentRepository', 'viewModels/questions/questionContent'],
    function (vmAnswers, vmLearningContents, router, eventTracker, answerOptionModel, learningContentModel, localizationManager, constants, questionRepository, objectiveRepository, system, notify, answerRepository, learningContentRepository, vmQuestionContent) {
        "use strict";
        var
            events = {
                updateQuestionTitle: 'Update question title',

                addAnswerOption: 'Add answer option',
                toggleAnswerCorrectness: 'Change answer option correctness',
                saveAnswerOption: 'Save the answer option text',
                deleteAnswerOption: 'Delete answer option',
                startEditingAnswerOption: 'Start editing answer option',
                endEditingAnswerOption: 'End editing answer option',

                addLearningContent: 'Add learning content',
                deleteLearningContent: 'Delete learning content',
                startEditingLearningContent: 'Start editing learning content',
                EndEditingLearningContent: 'End editing learning content',
                navigateToObjective: 'Navigate to objective',
            },

            sendEvent = function (eventName) {
                eventTracker.publish(eventName);
            };

        var
            objectiveId = '',
            questionId = '',
            title = ko.observable(''),
            language = ko.observable(),
            goBackTooltip = '';

        title.isEditing = ko.observable();
        title.isValid = ko.computed(function () {
            var length = title().trim().length;
            return length > 0 && length <= constants.validation.questionTitleMaxLength;
        });

        var
            navigateToObjective = function () {
                eventTracker.publish(events.navigateToObjective);
                router.navigateWithQueryString('objective/' + this.objectiveId);
            },

            startEditQuestionTitle = function () {
                title.isEditing(true);
            },

            endEditQuestionTitle = function () {
                title(title().trim());
                title.isEditing(false);

                var questionTitle = null;
                questionRepository.getById(objectiveId, questionId).then(function (response) {
                    questionTitle = response.title;

                    if (title() == questionTitle)
                        return;

                    sendEvent(events.updateQuestionTitle);

                    if (title.isValid()) {
                        questionRepository.updateTitle(questionId, title()).then(function () {
                            notify.info(localizationManager.localize('savedAt') + ' ' + new Date().toLocaleTimeString());
                        });
                    } else {
                        title(questionTitle);
                    }
                });
            },

            questionContent = null,
            answers = null,
            learningContents = null,

            activate = function (objId, quesId) {
                objectiveId = objId;
                questionId = quesId;
                this.language(localizationManager.currentLanguage);

                var that = this;
                return objectiveRepository.getById(objId).then(function (objective) {
                    that.objectiveId = objective.id;
                    that.goBackTooltip = localizationManager.localize('backTo') + ' \'' + objective.title + '\'';

                    return questionRepository.getById(objectiveId, questionId).then(function (question) {
                        that.title(question.title);
                        that.questionContent = vmQuestionContent(questionId, question.content);
                    }).fail(function () {
                        router.replace('404');
                        return;
                    });
                }).then(function () {
                    return answerRepository.getCollection(questionId).then(function (answerOptions) {
                        var sortedAnswers = _.sortBy(answerOptions, function (item) { return item.createdOn; });
                        that.answers = vmAnswers(questionId, sortedAnswers);
                    });
                }).then(function () {
                    return learningContentRepository.getCollection(questionId).then(function (learningContents) {
                        var sortedLearningContents = _.sortBy(learningContents, function (item) { return item.createdOn; });
                        that.learningContents = vmLearningContents(questionId, sortedLearningContents);
                    });
                });
            };

        return {
            title: title,
            objectiveId: objectiveId,
            questionTitleMaxLength: constants.validation.questionTitleMaxLength,
            language: language,
            eventTracker: eventTracker,

            activate: activate,

            goBackTooltip: goBackTooltip,
            navigateToObjective: navigateToObjective,

            startEditQuestionTitle: startEditQuestionTitle,
            endEditQuestionTitle: endEditQuestionTitle,

            questionContent: questionContent,
            answers: answers,
            learningContents: learningContents,
            localizationManager: localizationManager
        };
    }
);