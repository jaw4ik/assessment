define(['durandal/app', 'constants', 'eventTracker', 'repositories/answerRepository', 'viewmodels/questions/multipleChoice/multipleChoiceAnswers', 'localization/localizationManager'],
    function (app, constants, eventTracker, answerRepository, vmAnswers, localizationManager) {
        "use strict";

        var viewModel = {
            initialize: initialize,
            objectiveId: '',
            questionId: '',

            localizationManager: localizationManager,
            eventTracker: eventTracker,
            answers: null,

            isExpanded: ko.observable(true),
            toggleExpand: toggleExpand,

            contentUpdatedByCollaborator: contentUpdatedByCollaborator
        };

        app.on(constants.messages.question.contentUpdatedByCollaborator, contentUpdatedByCollaborator);

        return viewModel;

        function initialize(objectiveId, question) {
            viewModel.objectiveId = objectiveId;
            viewModel.questionId = question.id;

            return answerRepository.getCollection(question.id).then(function (answerOptions) {
                var sortedAnswers = _.sortBy(answerOptions, function (item) {
                    return item.createdOn;
                });
                viewModel.answers = vmAnswers(question.id, sortedAnswers);

                return {
                    viewCaption: localizationManager.localize('multipleChoiceEditor'),
                    isQuestionContentNeeded: true
                };
            });
        }

        function toggleExpand() {
            viewModel.isExpanded(!viewModel.isExpanded());
        }

        function contentUpdatedByCollaborator(question) {
            if (question.id != viewModel.questionId)
                return;

            viewModel.questionContent.originalText(question.content);
            if (!viewModel.questionContent.isEditing())
                viewModel.questionContent.text(question.content);
        }

    }
);
