define(['viewmodels/learningPaths/learningPath/actions/publishToCustomLms', 'constants'], function (publishToCustomLms, constants) {
    "use strict";

    var viewModel = {
        publishAction: publishToCustomLms(constants.eventCategories.header),
        activate: activate,
        deactivate: deactivate
    };

    return viewModel;

    function activate(learningPathId) {
        return viewModel.publishAction.activate(learningPathId);
    }

    function deactivate() {
        return viewModel.publishAction.deactivate();
    }
});