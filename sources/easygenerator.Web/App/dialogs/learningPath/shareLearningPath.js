define(['knockout', 'userContext', 'dialogs/learningPath/defaultPublish', 'dialogs/learningPath/customPublish', 'constants', 'eventTracker'], function (ko, userContext, defaultPublishModel, customPublishModel, constants, eventTracker) {
    'use strict';

    var viewModel = {
        learningPathId: '',
        publishModel: null,
        isShown: ko.observable(false),

        show: show,
        hide: hide,

        activate: activate
    }

    return viewModel;

    function show() {
        viewModel.isShown(true);
    }

    function hide() {
        viewModel.isShown(false);
    }

    function activate(learningPathId) {
        viewModel.learningPathId = learningPathId;
        var showCustomPublish = !!userContext.identity.company;
        viewModel.publishModel = showCustomPublish ? customPublishModel : defaultPublishModel;
    }
});