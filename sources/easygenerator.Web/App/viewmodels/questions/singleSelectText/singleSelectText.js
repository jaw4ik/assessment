define(['durandal/app', 'constants', 'eventTracker', 'repositories/answerRepository', 'viewmodels/questions/singleSelectText/singleSelectTextAnswers', 'localization/localizationManager'],
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
            toggleExpand: toggleExpand
        };

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
                    viewCaption: localizationManager.localize('singleSelectTextEditor'),
                    isQuestionContentNeeded: true
                };
            });
        }

        function toggleExpand() {
            viewModel.isExpanded(!viewModel.isExpanded());
        }
    }
);
