define(['durandal/app', 'constants', 'eventTracker', 'userContext', 'onboarding/initialization'], function (app, constants, eventTracker, userContext, initialization) {
    "use strict";

    var viewModel = {
        isExpanded: ko.observable(true),
        isVisible: ko.observable(true),
        onboardingClosed: ko.observable(false),

        expand: expand,
        collapse: collapse,
        onCollapsed: onCollapsed,

        activate: activate,
        attached: attached,
        detached: detached
    };

    app.on(constants.messages.onboarding.closed, onOnboardingClosed);

    return viewModel;

    function onOnboardingClosed() {
        viewModel.onboardingClosed(true);
    }

    function expand() {
        eventTracker.publish('Expand navigation bar');
        viewModel.isExpanded(true);
        _.defer(function () { viewModel.isVisible(true); });
        app.trigger(constants.messages.treeOfContent.expanded);
    }

    function collapse() {
        eventTracker.publish('Collapse navigation bar');
        viewModel.isExpanded(false);
        app.trigger(constants.messages.treeOfContent.collapsed);
    }

    function onCollapsed() {
        viewModel.isVisible(false);
    }

    function activate() {
        viewModel.onboardingClosed(initialization.isClosed());
    }

});