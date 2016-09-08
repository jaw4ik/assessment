define(['durandal/app', 'constants', 'eventTracker', 'repositories/answerRepository', 'viewmodels/questions/singleSelectText/singleSelectTextAnswers', 'localization/localizationManager'],
    function (app, constants, eventTracker, answerRepository, vmAnswers, localizationManager) {
        "use strict";

        var viewModel = {
            initialize: initialize,
            sectionId: '',
            questionId: '',
            surveyModeEnabled: ko.observable(false),

            localizationManager: localizationManager,
            eventTracker: eventTracker,
            answers: null,

            isExpanded: ko.observable(true),
            toggleExpand: toggleExpand
        };

        app.on(constants.messages.question.isSurveyUpdated, function (question) {
            if (question.id !== viewModel.questionId) {
                return;
            }
            viewModel.surveyModeEnabled(question.isSurvey);
        });

        return viewModel;

        function initialize(sectionId, question) {
            viewModel.sectionId = sectionId;
            viewModel.questionId = question.id;
            viewModel.surveyModeEnabled(question.isSurvey);

            return answerRepository.getCollection(question.id).then(function (answerOptions) {
                var sortedAnswers = _.sortBy(answerOptions, function (item) {
                    return item.createdOn;
                });
                viewModel.answers = vmAnswers(question.id, sortedAnswers);

                return {
                    viewCaption: localizationManager.localize('singleSelectTextEditor'),
                    hasQuestionView: true,
                    hasQuestionContent: true,
                    hasFeedback: true
                };
            });
        }

        function toggleExpand() {
            viewModel.isExpanded(!viewModel.isExpanded());
        }
    }
);
