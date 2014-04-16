define(['viewmodels/questions/answers', 'viewmodels/questions/learningContents', 'plugins/router', 'eventTracker', 'models/answerOption', 'models/learningContent',
        'localization/localizationManager', 'constants', 'repositories/questionRepository', 'repositories/objectiveRepository', 'durandal/system', 'notify',
        'repositories/answerRepository', 'repositories/learningContentRepository', 'clientContext', 'viewmodels/common/contentField', 'models/backButton'],
    function (vmAnswers, vmLearningContents, router, eventTracker, answerOptionModel, learningContentModel, localizationManager, constants, questionRepository,
        objectiveRepository, system, notify, answerRepository, learningContentRepository, clientContext, vmContentField, BackButton) {
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
                navigateToObjective: 'Navigate to objective details'
            },

            sendEvent = function (eventName) {
                eventTracker.publish(eventName);
            };
        
        var eventsForQuestionContent = {
            addContent: 'Add extra question content',
            beginEditText: 'Start editing question content',
            endEditText: 'End editing question content'
        };

        var
            objectiveId = '',
            questionId = '',
            title = ko.observable(''),
            language = ko.observable(),
            isCreatedQuestion = ko.observable(false);

        title.isEditing = ko.observable();
        title.isValid = ko.computed(function () {
            var length = title().trim().length;
            return length > 0 && length <= constants.validation.questionTitleMaxLength;
        });

        var
            navigateToObjectiveEvent = function () {
                eventTracker.publish(events.navigateToObjective);
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
                            notify.saved();
                        });
                    } else {
                        title(questionTitle);
                    }
                });
            },

            questionContent = null,
            answers = null,
            learningContents = null,

            activate = function (objId, quesId, queryParams) {
                objectiveId = objId;
                questionId = quesId;
                this.language(localizationManager.currentLanguage);

                var lastCreatedQuestionId = clientContext.get('lastCreatedQuestionId') || '';
                clientContext.remove('lastCreatedQuestionId');

                var that = this;
                return objectiveRepository.getById(objId).then(function (objective) {
                    that.objectiveId = objective.id;

                    that.backButtonData.configure({
                        url: 'objective/' + objective.id,
                        backViewName: '\'' + objective.title + '\'',
                        callback: navigateToObjectiveEvent,
                        alwaysVisible: _.isNullOrUndefined(queryParams) || !_.isString(queryParams.courseId)
                    });

                    return questionRepository.getById(objectiveId, questionId).then(function (question) {
                        that.isCreatedQuestion(lastCreatedQuestionId === question.id);
                        that.title(question.title);
                        that.questionContent = vmContentField(question.content, eventsForQuestionContent, true, function (content) { return questionRepository.updateContent(questionId, content); });
                    });
                }).then(function () {
                    return answerRepository.getCollection(questionId).then(function (answerOptions) {
                        var sortedAnswers = _.sortBy(answerOptions, function (item) {
                            return item.createdOn;
                        });
                        that.answers = vmAnswers(questionId, sortedAnswers);
                    });
                }).then(function () {
                    return learningContentRepository.getCollection(questionId).then(function (learningContents) {
                        var sortedLearningContents = _.sortBy(learningContents, function (item) {
                            return item.createdOn;
                        });
                        that.learningContents = vmLearningContents(questionId, sortedLearningContents);
                    });
                }).fail(function (reason) {
                    router.activeItem.settings.lifecycleData = { redirect: '404' };
                    throw reason;
                });
            };

        return {
            title: title,
            objectiveId: objectiveId,
            questionTitleMaxLength: constants.validation.questionTitleMaxLength,
            language: language,
            eventTracker: eventTracker,

            activate: activate,

            navigateToObjectiveEvent: navigateToObjectiveEvent,

            startEditQuestionTitle: startEditQuestionTitle,
            endEditQuestionTitle: endEditQuestionTitle,

            questionContent: questionContent,
            answers: answers,
            learningContents: learningContents,
            localizationManager: localizationManager,
            isCreatedQuestion: isCreatedQuestion,

            backButtonData: new BackButton({})
        };
    }
);