define(['durandal/app', 'constants', 'eventTracker', 'repositories/answerRepository', 'viewmodels/questions/multipleSelect/multipleSelectAnswers', 'localization/localizationManager'],
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

            return Q.fcall(function () {
                return {
                    viewCaption: localizationManager.localize('singleSelectImageEditor'),
                    isQuestionContentNeeded: true
                };
            });
        }

        function toggleExpand() {
            viewModel.isExpanded(!viewModel.isExpanded());
        }
    }
);