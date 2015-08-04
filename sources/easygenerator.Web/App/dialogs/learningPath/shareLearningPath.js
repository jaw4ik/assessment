define(['knockout', 'viewmodels/learningPaths/learningPath/actions/publish', 'constants', 'eventTracker'], function (ko, publishAction, constants, eventTracker) {
    'use strict';

    var events = {
        openEmbedTab: 'Open embed tab',
        openLinkTab: 'Open link tab'
    };

    var viewModel = {
        isShown: ko.observable(false),
        publishAction: publishAction(),
        show: show,
        hide: hide,
        embedTabOpened: ko.observable(false),
        linkTabOpened: ko.observable(true),
        onOpenEmbedTab: onOpenEmbedTab,
        onOpenLinkTab: onOpenLinkTab
    }

    return viewModel;

    function show(learningPath) {
        viewModel.publishAction.activate(learningPath);
        viewModel.isShown(true);
    }

    function hide() {
        viewModel.publishAction.deactivate();
        viewModel.isShown(false);
    }

    function onOpenEmbedTab() {
        eventTracker.publish(events.openEmbedTab);
        viewModel.linkTabOpened(false);
        viewModel.embedTabOpened(true);
    }

    function onOpenLinkTab() {
        eventTracker.publish(events.openLinkTab);
        viewModel.embedTabOpened(false);
        viewModel.linkTabOpened(true);
    }
});