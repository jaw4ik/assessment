define(['viewmodels/courses/publishingActions/publishToCustomLms', 'constants'], function (publishToCustomLms, constants) {
    "use strict";

    var viewModel = {
        publishAction: publishToCustomLms(constants.eventCategories.header),
        activate: activate,
        deactivate: deactivate
    };

    return viewModel;

    function activate(courseId) {
        return viewModel.publishAction.activate(courseId);
    }

    function deactivate() {
        return viewModel.publishAction.deactivate();
    }
});