define(['eventTracker', 'viewmodels/learningPaths/learningPath/queries/getLearningPathByIdQuery', 'viewmodels/learningPaths/learningPath/actions/download', 'viewmodels/learningPaths/learningPath/actions/publish'], function (eventTracker, getLearningPathByIdQuery, downloadAction, publishAction) {
    'use strict';

    var events = {
        openEmbedTab: 'Open embed tab',
        openLinkTab: 'Open link tab',
        openHtmlTab: 'Open \'downoload HTML\'',
    };

    var viewModel = {
        learningPath: null,
        downloadAction: downloadAction(),
        publishAction: publishAction(),

        onOpenLinkTab: onOpenLinkTab,
        onOpenEmbedTab: onOpenEmbedTab,
        onOpenHtmlTab: onOpenHtmlTab,

        activate: activate,
        deactivate: deactivate
    };

    return viewModel;

    function activate(learningPathId) {
        return getLearningPathByIdQuery.execute(learningPathId).then(function (learningPath) {
            viewModel.learningPath = learningPath;
        });
    }

    function deactivate() {
        viewModel.downloadAction.deactivate();
        viewModel.publishAction.deactivate();
    }

    function onOpenLinkTab() {
        eventTracker.publish(events.openLinkTab);
    }

    function onOpenEmbedTab() {
        eventTracker.publish(events.openEmbedTab);
    }

    function onOpenHtmlTab() {
        eventTracker.publish(events.openHtmlTab);
    }
});