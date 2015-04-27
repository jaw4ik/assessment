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
                    viewCaption: localizationManager.localize('informationContentEditor'),
                    isInformationContent : true
                };
            });
        }
    }
);
