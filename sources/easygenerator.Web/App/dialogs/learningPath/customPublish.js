define(['viewmodels/learningPaths/learningPath/actions/publishToCustomLms', 'constants'], function (publishToCustomLms, constants) {
    "use strict";

    var viewModel = {
        publishAction: publishToCustomLms(constants.eventCategories.header),
        activate: activate,
        deactivate: deactivate
    };

    return viewModel;

    function activate(publishData) {
        return viewModel.publishAction.activate(publishData);
    }

    function deactivate() {
        return viewModel.publishAction.deactivate();
    }
});