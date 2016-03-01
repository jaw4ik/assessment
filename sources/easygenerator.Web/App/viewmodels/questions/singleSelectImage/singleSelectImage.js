define(['constants', 'eventTracker', 'viewmodels/questions/multipleSelect/multipleSelectAnswers', 'localization/localizationManager',
'viewmodels/questions/singleSelectImage/designer'],
    function (constants, eventTracker, vmAnswers, localizationManager, designer) {
        "use strict";

        var viewModel = {
            initialize: initialize,
            sectionId: '',
            questionId: '',

            singleSelectImage: designer
        };

        return viewModel;

        function initialize(sectionId, question) {
            viewModel.sectionId = sectionId;
            viewModel.questionId = question.id;

            return designer.activate(question.id).then(function () {
                return {
                    viewCaption: localizationManager.localize('singleSelectImageEditor'),
                    hasQuestionView: true,
                    hasQuestionContent: true,
                    hasFeedback: true
                };
            });
        }
    }
);