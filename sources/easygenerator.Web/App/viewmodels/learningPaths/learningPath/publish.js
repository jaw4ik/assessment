define(['eventTracker', 'viewmodels/learningPaths/learningPath/queries/getLearningPathByIdQuery', 'viewmodels/learningPaths/learningPath/actions/download', 'viewmodels/learningPaths/learningPath/actions/publish'], function (eventTracker, getLearningPathByIdQuery, downloadAction, buildAction) {
    'use strict';

    var events = {
        openEmbedTab: 'Open embed tab',
        openLinkTab: 'Open link tab',
        openHtmlTab: 'Open \'downoload HTML\'',
    };

    var viewModel = {
        learningPath: null,
        buildAction: downloadAction(),
        publishAction: buildAction(),

        activate: activate,
        deactivate: deactivate,

        sendOpenLinkTab: sendOpenLinkTab,
        sendOpenEmbedTab: sendOpenEmbedTab,
        sendOpenHtmlTab: sendOpenHtmlTab
    };

    return viewModel;

    function activate(learningPathId) {
        return getLearningPathByIdQuery.execute(learningPathId).then(function(learningPath) {
            viewModel.learningPath = learningPath;
        });
    }

    function deactivate() {

    }

    function sendOpenLinkTab() {
        eventTracker.publish(events.openLinkTab);
    }

    function sendOpenEmbedTab() {
        eventTracker.publish(events.openEmbedTab);
    }

    function sendOpenHtmlTab() {
        eventTracker.publish(events.openHtmlTab);
    }
});