define(['viewmodels/courses/publishingActions/publishToCustomLms', 'constants'], function (PublishToCustomLms, constants) {
    "use strict";

    var viewModel = {
        publishAction: new PublishToCustomLms(constants.eventCategories.header),
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