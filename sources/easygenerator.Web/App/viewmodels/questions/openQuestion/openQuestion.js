define(['localization/localizationManager'],
    function (localizationManager) {
        "use strict";

        var viewModel = {
            initialize: initialize
        };

        return viewModel;

        function initialize() {
            return Q.fcall(function () {
                return {
                    viewCaption: localizationManager.localize('openQuestionEditor'),
                    hasQuestionContent: true,
                    hasFeedback: true,
                    feedbackCaptions: {
                        correctFeedback: {
                            hint: localizationManager.localize('responseForProvidedAnswer'),
                            instruction: localizationManager.localize('createResponseForProvidedAnswer')
                        },
                        incorrectFeedback: {
                            hint: localizationManager.localize('responseForEmptyAnswer'),
                            instruction: localizationManager.localize('createResponseForEmptyAnswer')
                        }
                    }
                };
            });
        }
    }
);
