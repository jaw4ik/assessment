define(['durandal/app',
    'constants',
    'eventTracker',
    'localization/localizationManager',
    'viewmodels/questions/textMatching/queries/getTextMatchingAnswersById'],
    function (app, constants, eventTracker, localizationManager, getTextMatchingAnswersById) {
        "use strict";

        var viewModel = {
            initialize: initialize,
            objectiveId: '',
            questionId: '',
        };

        return viewModel;

        function initialize(objectiveId, question) {
            viewModel.objectiveId = objectiveId;
            viewModel.questionId = question.id;

            return Q.fcall(function() {
                return {
                    viewCaption: localizationManager.localize('textMatchingEditor'),
                    isQuestionContentNeeded: true
                };
            });
        }
    }
);