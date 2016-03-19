define(['durandal/app', 'constants', 'eventTracker', 'localization/localizationManager', 'repositories/answerRepository', 'viewmodels/questions/statement/statementAnswers'],
    function (app, constants, eventTracker, localizationManager, answerRepository, vmAnswers) {
        "use strict";

        var viewModel = {
            initialize: initialize,
            sectionId: '',
            questionId: '',

            isExpanded: ko.observable(true),
            toggleExpand: toggleExpand,

            answers: null
        };

        return viewModel;

        function initialize(sectionId, question) {
            viewModel.sectionId = sectionId;
            viewModel.questionId = question.id;

            return answerRepository.getCollection(question.id).then(function (answerOptions) {
                var sortedAnswers = _.sortBy(answerOptions, function (item) {
                    return item.createdOn;
                });
                viewModel.answers = vmAnswers(question.id, sortedAnswers);

                return {
                    viewCaption: localizationManager.localize('statementQuestionEditor'),
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