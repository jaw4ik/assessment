define(['viewmodels/courses/publishingActions/publish', 'viewmodels/courses/publishingActions/publishToCustomLms', 'constants', 'eventTracker', 'userContext'],
    function (publishAction, publishToCustomLms, constants, eventTracker, userContext) {

        "use strict";

        var events = {
            openEmbedTab: 'Open embed tab',
            openLinkTab: 'Open link tab'
        };

        var viewModel = {
            isShown: ko.observable(false),
            hideDefaultPublish: ko.observable(false),
            publishAction: publishAction(constants.eventCategories.header),
            show: show,
            hide: hide,
            embedTabOpened: ko.observable(false),
            linkTabOpened: ko.observable(true),
            openEmbedTab: openEmbedTab,
            openLinkTab: openLinkTab
        };

        return viewModel;

        function show(courseId) {
            
                viewModel.hideDefaultPublish(userContext.identity.company.hideDefaultPublishOptions);
                viewModel.publishAction = viewModel.hideDefaultPublish() ? publishToCustomLms(constants.eventCategories.header) : publishAction(constants.eventCategories.header);
                viewModel.publishAction.activate(courseId);
                viewModel.isShown(true);
            
        }

        function hide() {
            viewModel.isShown(false);
            viewModel.publishAction.deactivate();
        }

        function openEmbedTab() {
            if (!viewModel.embedTabOpened()) {
                eventTracker.publish(events.openEmbedTab, constants.eventCategories.header);
                viewModel.linkTabOpened(false);
                viewModel.embedTabOpened(true);
            }
        }

        function openLinkTab() {
            if (!viewModel.linkTabOpened()) {
                eventTracker.publish(events.openLinkTab, constants.eventCategories.header);
                viewModel.embedTabOpened(false);
                viewModel.linkTabOpened(true);
            }
        }
    });