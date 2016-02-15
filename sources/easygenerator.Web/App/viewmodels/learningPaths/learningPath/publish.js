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
        publishToCustomLmsModels: [],
        downloadAction: downloadAction(),
        publishAction: publishAction(),

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
            viewModel.publishToCustomLmsModels = userContext.identity.companies.sort((company1, company2) => {
                if (company1.priority === company2.priority) {
                    return (new Date(company1.createdOn)).getTime() > (new Date(company2.createdOn)).getTime();
                }
                return company1.priority < company2.priority;
            }).map(function (company) {
                return {
                    company: company,
                    model: publishToCustomLmsAction()
                }
            });
        });
    }

    function deactivate() {
        viewModel.downloadAction.deactivate();
        viewModel.publishAction.deactivate();
        viewModel.publishToCustomLmsModels.forEach(function (publishToCustomLmsModel) {
            publishToCustomLmsModel.model.deactivate();
        });
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