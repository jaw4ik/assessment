define(['viewmodels/learningPaths/learningPath/actions/publish', 'constants', 'eventTracker'],
    function (publishAction, constants, eventTracker) {

        "use strict";

        var events = {
            openEmbedTab: 'Open embed tab',
            openLinkTab: 'Open link tab'
        };

        var viewModel = {
            publishAction: publishAction(constants.eventCategories.header),

            embedTabOpened: ko.observable(false),
            linkTabOpened: ko.observable(true),
            openEmbedTab: openEmbedTab,
            openLinkTab: openLinkTab,

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

        function openEmbedTab() {
            if (viewModel.embedTabOpened()) {
                return;
            }

            eventTracker.publish(events.openEmbedTab, constants.eventCategories.header);
            viewModel.linkTabOpened(false);
            viewModel.embedTabOpened(true);
        }

        function openLinkTab() {
            if (viewModel.linkTabOpened()) {
                return;
            }

            eventTracker.publish(events.openLinkTab, constants.eventCategories.header);
            viewModel.embedTabOpened(false);
            viewModel.linkTabOpened(true);
        }
    });