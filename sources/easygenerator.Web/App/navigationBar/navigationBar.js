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

    var subscriptions = [];

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




    function attached(bar) {

        var element = $(bar).parent();

        $(element).css({
            'padding-left': viewModel.isVisible() ? '300px' : '50px'
        });

        subscriptions.push(app.on(constants.messages.treeOfContent.expanded).then(function () {
            $(element).finish().animate({
                'padding-left': '300px',
            }, 400);
        }));
        subscriptions.push(app.on(constants.messages.treeOfContent.collapsed).then(function () {
            $(element).finish().animate({
                'padding-left': '50px',
            }, 400);
        }));
    }

    function detached() {
        subscriptions.forEach(function (subscription) {
            subscription.off();
        });
    }


});