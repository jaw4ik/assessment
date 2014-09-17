define(['durandal/app', 'constants', 'http/httpWrapper', 'localization/localizationManager', 'onboarding/handlers'], function (app, constants, httpWrapper, localizationManager, handlers) {
    "use strict";

    var
        tasks = {};

    var onboarding = {
        getTasksList: getTasksList,

        close: close,
        initialize: initialize,
        isClosed: ko.observable(false)
    };

    return onboarding;

    function initialize() {
        return getStates().then(function (onboardingStates) {
            if (!_.isNullOrUndefined(onboardingStates.isClosed)) {
                onboarding.isClosed(onboardingStates.isClosed);
                return;
            }

            _.each(onboardingStates, function (state, name) {
                if (_.isBoolean(state) && !state) {
                    app.on(constants.messages.onboarding[name], handlers[name], tasks);
                } else if (!_.isBoolean(state) && !(state.value >= state.rule)) {
                    app.on(constants.messages.onboarding[name], handlers[name], tasks);
                }
                if (_.isBoolean(state)) {
                    tasks[name] = {
                        title: localizationManager.localize(name),
                        isCompleted: ko.observable(state)
                    };
                } else {
                    tasks[name] = {
                        title: localizationManager.localize(name)
                    };
                    tasks[name][name] = ko.observable(state.value);
                    tasks[name].isCompleted = ko.computed(function () {
                        return tasks[name][name]() >= state.rule;
                    });
                }
            });
        });
    }

    function close() {
        return httpWrapper.post('api/onboarding/close').then(function () {
            app.trigger(constants.messages.onboarding.closed);
        });
    }

    function getTasksList() {
        return _.toArray(tasks);
    }

    function getStates() {
        return httpWrapper.post('api/onboarding');
    }

});