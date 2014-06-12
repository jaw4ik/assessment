define(['eventTracker', 'notify', 'viewmodels/questions/questionTitle', 'viewmodels/common/contentField', 'repositories/questionRepository', 'clientContext',
        'repositories/answerRepository', 'repositories/learningContentRepository', 'models/backButton', 'viewmodels/questions/multipleSelect/multipleSelectAnswers', 'viewmodels/questions/learningContents',
        'plugins/router', 'localization/localizationManager', 'constants'],
    function (eventTracker, notify, questionTitle, vmContentField, questionRepository, clientContext, answerRepository, learningContentRepository, BackButton, vmAnswers,
        vmLearningContents, router, localizationManager, constants) {
        "use strict";

        var eventsForQuestionContent = {
            addContent: 'Add extra question content',
            beginEditText: 'Start editing question content',
            endEditText: 'End editing question content'
        };

        var viewModel = {
            initialize: initialize,
            objectiveId: '',
            title: null,
            questionTitleMaxLength: constants.validation.questionTitleMaxLength,
            localizationManager: localizationManager,
            eventTracker: eventTracker,
            questionContent: null,
            backButtonData: new BackButton({}),
            answers: null,
            learningContents: null,
            isCreatedQuestion: ko.observable(false)
        };

        return viewModel;

        function initialize(objectiveId, question) {
            viewModel.objectiveId = objectiveId;
            viewModel.title = questionTitle(objectiveId, question);
            viewModel.questionContent = vmContentField(question.content, eventsForQuestionContent, true, function (content) { return questionRepository.updateContent(question.id, content); });
            var lastCreatedQuestionId = clientContext.get('lastCreatedQuestionId') || '';
            clientContext.remove('lastCreatedQuestionId');
            viewModel.isCreatedQuestion(lastCreatedQuestionId === question.id);
            return answerRepository.getCollection(question.id).then(function (answerOptions) {
                var sortedAnswers = _.sortBy(answerOptions, function (item) {
                    return item.createdOn;
                });
                viewModel.answers = vmAnswers(question.id, sortedAnswers);
            }).then(function () {
                return learningContentRepository.getCollection(question.id).then(function (learningContents) {
                    var sortedLearningContents = _.sortBy(learningContents, function (item) {
                        return item.createdOn;
                    });
                    viewModel.learningContents = vmLearningContents(question.id, sortedLearningContents);
                });
            });
        }

    }
);