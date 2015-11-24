define(['knockout', 'userContext', 'dialogs/learningPath/defaultPublish', 'dialogs/learningPath/customPublish', 'constants', 'eventTracker'], function (ko, userContext, defaultPublishModel, customPublishModel, constants, eventTracker) {
    'use strict';

    var viewModel = {
        publishModel: null,
        isShown: ko.observable(false),

        show: show,
        hide: hide,

        activate: activate
    }

    return viewModel;

    function show(learningPathId) {
        viewModel.publishModel.activate(learningPathId);
        viewModel.isShown(true);
    }

    function hide() {
        viewModel.publishModel.deactivate();
        viewModel.isShown(false);
    }

    function activate() {
        var showCustomPublish = !!userContext.identity.company;
        viewModel.publishModel = showCustomPublish ? customPublishModel : defaultPublishModel;
    }
});