define(['onboarding/initialization', 'clientContext'], function (onboardingInitialization, clientContext) {
    "use strict";

    var onboardingCollapsedStateKey = 'onboarding:collapsed';

    var viewModel = {
        tasks: ko.observableArray([]),
        isMinimized: ko.observable(false),
        isVisible: ko.observable(false),
        isCollapsed: ko.observable(false),

        closeOnboarding: closeOnboarding,
        toggleCollapse: toggleCollapse,
        closeAllHints: onboardingInitialization.closeAllHints,

        activate: activate
    };

    viewModel.isCompleted = ko.computed(function() {
        return _.every(viewModel.tasks(), function(task) {
            return task.isCompleted();
        });
    });

    return viewModel;

    function activate(settings) {
        viewModel.isVisible(false);

        if (onboardingInitialization.isClosed()) {
            return;
        }

        viewModel.isCollapsed(clientContext.get(onboardingCollapsedStateKey));
        viewModel.tasks(onboardingInitialization.getTasksList());
        viewModel.isMinimized(settings.isMinimized);
        viewModel.isVisible(true);
    }

    function closeOnboarding() {
        onboardingInitialization.closeOnboarding();
        viewModel.isVisible(false);
    }

    function toggleCollapse() {
        viewModel.isCollapsed(!viewModel.isCollapsed());
        clientContext.set(onboardingCollapsedStateKey, viewModel.isCollapsed());
    }

});