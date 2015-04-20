define(['viewmodels/courses/publishingActions/publish', 'constants', 'eventTracker'],
    function (publishAction, constants, eventTracker) {

        "use strict";

        var events = {
            openEmbedTab: 'Open embed tab',
            openLinkTab: 'Open link tab'
        };

        var viewModel = {
            isShown: ko.observable(false),
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