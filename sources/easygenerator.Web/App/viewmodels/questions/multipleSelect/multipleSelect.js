define(['durandal/app', 'constants', 'eventTracker', 'repositories/answerRepository', 'viewmodels/questions/multipleSelect/multipleSelectAnswers', 'localization/localizationManager'],
    function (app, constants, eventTracker, answerRepository, vmAnswers, localizationManager) {
        "use strict";

        var viewModel = {
            initialize: initialize,
            sectionId: '',
            questionId: '',

            localizationManager: localizationManager,
            eventTracker: eventTracker,
            answers: null,

            isExpanded: ko.observable(true),
            toggleExpand: toggleExpand
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
                    viewCaption: localizationManager.localize('multipleSelectEditor'),
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