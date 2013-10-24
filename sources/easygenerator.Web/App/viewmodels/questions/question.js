define(['viewmodels/questions/answers', 'viewmodels/questions/learningObjects', 'plugins/router', 'eventTracker', 'models/answerOption', 'models/learningObject', 'localization/localizationManager', 'constants', 'repositories/questionRepository', 'repositories/objectiveRepository', 'durandal/system', 'notify', 'repositories/answerRepository', 'repositories/learningObjectRepository'],
    function (vmAnswers, vmLearningObjects, router, eventTracker, answerOptionModel, learningObjectModel, localizationManager, constants, questionRepository, objectiveRepository, system, notify, answerRepository, learningObjectRepository) {
        "use strict";
        var
            events = {
                navigateToRelatedObjective: 'Navigate to related objective',
                updateQuestionTitle: 'Update question title',
                navigateToCreateQuestion: 'Navigate to create question',

                addAnswerOption: 'Add answer option',
                toggleAnswerCorrectness: 'Change answer option correctness',
                saveAnswerOption: 'Save the answer option text',
                deleteAnswerOption: 'Delete answer option',
                startEditingAnswerOption: 'Start editing answer option',
                endEditingAnswerOption: 'End editing answer option',

                addLearningObject: 'Add learning object',
                deleteLearningObject: 'Delete learning object',
                startEditingLearningObject: 'Start editing learning object',
                EndEditingLearningObject: 'End editing learning object'
            },

            sendEvent = function (eventName) {
                eventTracker.publish(eventName);
            };

        var
            objectiveId = '',
            questionId = '',
            objectiveTitle = '',
            title = ko.observable(''),
            language = ko.observable();

        title.isEditing = ko.observable();
        title.isValid = ko.computed(function () {
            var length = title().trim().length;
            return length > 0 && length <= constants.validation.questionTitleMaxLength;
        });

        var
            goToRelatedObjective = function () {
                sendEvent(events.navigateToRelatedObjective);
                router.navigateWithQueryString('objective/' + objectiveId);
            },
            goToCreateQuestion = function () {
                sendEvent(events.navigateToCreateQuestion);
                router.navigateWithQueryString('objective/' + objectiveId + '/question/create');
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

            answers = null,
            learningObjects = null,

            activate = function (objId, quesId) {
                objectiveId = objId;
                questionId = quesId;
                this.language(localizationManager.currentLanguage);

                var that = this;
                return objectiveRepository.getById(objId).then(function (objective) {
                    questionRepository.getById(objectiveId, questionId).then(function (question) {
                        that.title(question.title);
                        that.objectiveTitle = objective.title;
                    }).fail(function () {
                        router.replace('404');
                        return;
                    });
                }).then(function () {
                    return answerRepository.getCollection(questionId).then(function (answerOptions) {
                        that.answers = vmAnswers(questionId, answerOptions);
                    });
                }).then(function () {
                    return learningObjectRepository.getCollection(questionId).then(function (learningObjects) {
                        that.learningObjects = vmLearningObjects(questionId, learningObjects);
                    });
                }).fail(function () {
                    router.replace('404');
                    return;
                });
            };

        return {
            objectiveTitle: objectiveTitle,
            title: title,
            questionTitleMaxLength: constants.validation.questionTitleMaxLength,
            language: language,
            eventTracker: eventTracker,

            activate: activate,

            goToRelatedObjective: goToRelatedObjective,
            goToCreateQuestion: goToCreateQuestion,
            startEditQuestionTitle: startEditQuestionTitle,
            endEditQuestionTitle: endEditQuestionTitle,

            answers: answers,
            learningObjects: learningObjects
        };
    }
);