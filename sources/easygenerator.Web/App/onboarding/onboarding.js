define(['onboarding/initialization'], function (onboardingInitialization) {
    "use strict";

    var viewModel = {
        tasks: ko.observableArray([]),
        isMinimized: ko.observable(false),
        isVisible: ko.observable(false),

        closeOnboarding: closeOnboarding,
        closeAllHints: onboardingInitialization.closeAllHints,

        activate: activate
    };

    viewModel.isCompleted = ko.computed(function () {
        return _.every(viewModel.tasks(), function (task) {
            return task.isCompleted();
        });
    });

    return viewModel;

    function activate(settings) {
        viewModel.isVisible(false);
        viewModel.tasks(onboardingInitialization.getTasksList());
        viewModel.isMinimized(settings.isMinimized);
        viewModel.isVisible(true);
    }

    function closeOnboarding() {
        onboardingInitialization.closeOnboarding();
    }
})