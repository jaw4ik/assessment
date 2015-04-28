define(['constants', 'eventTracker', 'viewmodels/questions/multipleSelect/multipleSelectAnswers', 'localization/localizationManager',
'viewmodels/questions/singleSelectImage/designer'],
    function (constants, eventTracker, vmAnswers, localizationManager, designer) {
        "use strict";

        var viewModel = {
            initialize: initialize,
            objectiveId: '',
            questionId: '',

            singleSelectImage: designer
        };

        return viewModel;

        function initialize(objectiveId, question) {
            viewModel.objectiveId = objectiveId;
            viewModel.questionId = question.id;

            return designer.activate(question.id).then(function () {
                return {
                    viewCaption: localizationManager.localize('singleSelectImageEditor'),
                    isQuestionContentNeeded: true
                };
            });
        }
    }
);