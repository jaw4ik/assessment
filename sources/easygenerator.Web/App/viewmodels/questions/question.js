define(['viewmodels/questions/answers', 'viewmodels/questions/learningObjects', 'plugins/router', 'eventTracker', 'models/answerOption', 'models/learningObject', 'localization/localizationManager', 'constants', 'repositories/questionRepository', 'repositories/objectiveRepository', 'durandal/system', 'notify', 'repositories/answerRepository'],
    function (vmAnswers, vmLearningObjects, router, eventTracker, answerOptionModel, learningObjectModel, localizationManager, constants, questionRepository, objectiveRepository, system, notify, answerRepository) {
        "use strict";
        var
            events = {
                navigateToRelatedObjective: 'Navigate to related objective',
                navigateToNextQuestion: 'Navigate to next question',
                navigateToPreviousQuestion: 'Navigate to previous question',
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
            previousId = '',
            nextId = '',
            objectiveTitle = '',
            createdOn = null,
            modifiedOn = ko.observable(),
            hasPrevious = false,
            hasNext = false,
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
            goToPreviousQuestion = function () {
                if (!this.hasPrevious)
                    router.replace('404');

                sendEvent(events.navigateToPreviousQuestion);
                router.navigateWithQueryString('objective/' + objectiveId + '/question/' + previousId);
            },
            goToNextQuestion = function () {
                if (!this.hasNext)
                    router.replace('404');

                sendEvent(events.navigateToNextQuestion);
                router.navigateWithQueryString('objective/' + objectiveId + '/question/' + nextId);
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

                var that = this;
                var questionTitle = null;
                questionRepository.getById(objectiveId, questionId).then(function (response) {
                    questionTitle = response.title;

                    if (title() == questionTitle)
                        return;

                    sendEvent(events.updateQuestionTitle);

                    if (title.isValid()) {
                        questionRepository.updateTitle(questionId, title()).then(function (modifiedOn) {
                            that.modifiedOn(modifiedOn);
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
                        that.createdOn = question.createdOn;
                        that.modifiedOn(question.modifiedOn);

                        that.learningObjects = vmLearningObjects(questionId, question.learningObjects);

                        var questionIndex = objective.questions.indexOf(question);
                        nextId = (objective.questions.length > questionIndex + 1) ? objective.questions[questionIndex + 1].id : null;
                        previousId = (questionIndex != 0) ? objective.questions[questionIndex - 1].id : null;

                        that.hasNext = nextId != null;
                        that.hasPrevious = previousId != null;
                    }).fail(function () {
                            router.replace('404');
                            return;
                        });
                }).then(function () {
                    return answerRepository.getCollection(questionId).then(function (answerOptions) {
                        that.answers = vmAnswers(questionId, answerOptions);
                    });
                }).fail(function () {
                    router.replace('404');
                    return;
                });
            };

        return {
            objectiveTitle: objectiveTitle,
            title: title,
            createdOn: createdOn,
            modifiedOn: modifiedOn,
            questionTitleMaxLength: constants.validation.questionTitleMaxLength,
            hasPrevious: hasPrevious,
            hasNext: hasNext,
            language: language,
            eventTracker: eventTracker,

            activate: activate,

            goToRelatedObjective: goToRelatedObjective,
            goToPreviousQuestion: goToPreviousQuestion,
            goToNextQuestion: goToNextQuestion,
            goToCreateQuestion: goToCreateQuestion,
            startEditQuestionTitle: startEditQuestionTitle,
            endEditQuestionTitle: endEditQuestionTitle,

            answers: answers,
            learningObjects: learningObjects
        };
    }
);