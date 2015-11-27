define(['eventTracker', 'viewmodels/learningPaths/learningPath/actions/download', 'viewmodels/learningPaths/learningPath/actions/publish', 'viewmodels/learningPaths/learningPath/actions/publishToCustomLms', 'userContext'], function (eventTracker, downloadAction, publishAction, publishToCustomLmsAction, userContext) {
    'use strict';

    var events = {
        openEmbedTab: 'Open embed tab',
        openLinkTab: 'Open link tab',
        openHtmlTab: 'Open \'downoload HTML\'',
        openCustomPublishTab: 'Open custom publish tab'
    };

    var viewModel = {
        learningPathId: '',
        companyInfo: null,
        downloadAction: downloadAction(),
        publishAction: publishAction(),
        publishToCustomLmsAction: publishToCustomLmsAction(),

        onOpenLinkTab: onOpenLinkTab,
        onOpenEmbedTab: onOpenEmbedTab,
        onOpenHtmlTab: onOpenHtmlTab,
        onOpenCustomPublishTab: onOpenCustomPublishTab,

        activate: activate,
        deactivate: deactivate
    };

    return viewModel;

    function activate(learningPathId) {
        viewModel.learningPathId = learningPathId;

        return userContext.identify().then(function () {
            viewModel.companyInfo = userContext.identity ? userContext.identity.company : null;
        });
    }

    function deactivate() {
        viewModel.downloadAction.deactivate();
        viewModel.publishAction.deactivate();
        viewModel.publishToCustomLmsAction.deactivate();
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

    function onOpenCustomPublishTab() {
        eventTracker.publish(events.openCustomPublishTab);
    }
});