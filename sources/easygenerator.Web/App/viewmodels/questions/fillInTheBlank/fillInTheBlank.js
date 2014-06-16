define(['eventTracker', 'notify', 'viewmodels/questions/questionTitle', 'viewmodels/questions/fillInTheBlank/fibControl', 'repositories/questionRepository', 'clientContext',
        'repositories/answerRepository', 'repositories/learningContentRepository', 'models/backButton', 'viewmodels/questions/learningContents',
        'plugins/router', 'localization/localizationManager', 'constants'],
    function (eventTracker, notify, questionTitle, fibControl, questionRepository, clientContext, answerRepository, learningContentRepository, BackButton,
    vmLearningContents, router, localizationManager, constants) {
        "use strict";

        var eventsForQuestionContent = {
            addFillInTheBlank: 'Add fill in the blank content',
            beginEditText: 'Start editing fill in the blank content',
            endEditText: 'End editing fill in the blank content'
        };

        var viewModel = {
            initialize: initialize,
            objectiveId: '',
            title: null,
            questionTitleMaxLength: constants.validation.questionTitleMaxLength,
            eventTracker: eventTracker,
            localizationManager: localizationManager,
            fillInTheBlank: null,
            backButtonData: new BackButton({}),
            learningContents: null,
            isCreatedQuestion: ko.observable(false),
            isExpanded: ko.observable(true),
            toggleExpand: toggleExpand
        };

        return viewModel;

        function initialize(objectiveId, question) {
            viewModel.objectiveId = objectiveId;
            viewModel.title = questionTitle(objectiveId, question);
            var lastCreatedQuestionId = clientContext.get('lastCreatedQuestionId') || '';
            clientContext.remove('lastCreatedQuestionId');
            viewModel.isCreatedQuestion(lastCreatedQuestionId === question.id);
            return answerRepository.getCollection(question.id).then(function (answerOptions) {
                viewModel.fillInTheBlank = fibControl(question.content, answerOptions, eventsForQuestionContent, true, function (template, answers) {
                    return questionRepository.updateFillInTheBlank(question.id, template, answers);
                });
            }).then(function () {
                return learningContentRepository.getCollection(question.id).then(function (learningContents) {
                    var sortedLearningContents = _.sortBy(learningContents, function (item) {
                        return item.createdOn;
                    });
                    viewModel.learningContents = vmLearningContents(question.id, sortedLearningContents);
                });
            });
        }

        function toggleExpand() {
            viewModel.isExpanded(!viewModel.isExpanded());
        }

        function contentUpdated(question) {
            if (question.id != viewModel.questionId || viewModel.questionContent.isEditing())
                return;

            viewModel.questionContent.text(question.content);
        }

    });