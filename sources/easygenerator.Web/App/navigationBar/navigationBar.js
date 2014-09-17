define(['durandal/app', 'constants', 'eventTracker', 'userContext', 'onboarding/inititalization'], function (app, constants, eventTracker, userContext, inititalization) {
    "use strict";

    var viewModel = {
        isExpanded: ko.observable(true),
        isVisible: ko.observable(true),
        onboardingClosed: ko.observable(false),

        expand: expand,
        collapse: collapse,
        onCollapsed: onCollapsed,

        activate: activate
    };

    app.on(constants.messages.onboarding.closed, onOnboardingClosed);

    return viewModel;

    function onOnboardingClosed() {
        viewModel.onboardingClosed(false);
    }

    function expand() {
        eventTracker.publish('Expand navigation bar');
        viewModel.isExpanded(true);
        viewModel.isVisible(true);
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
        viewModel.onboardingClosed(!inititalization.isClosed());
    }

});