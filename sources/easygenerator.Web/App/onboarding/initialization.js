define(['durandal/app', 'constants', 'http/apiHttpWrapper', 'onboarding/tasks'],
    function (app, constants, apiHttpWrapper, tasks) {
        "use strict";

        var tasksList = [];

        var onboarding = {
            getTasksList: getTasksList,

            isClosed: ko.observable(false),
            closeOnboarding: closeOnboarding,
            closeAllHints: closeAllHints,

            initialize: initialize
        };

        return onboarding;

        function initialize() {
            return apiHttpWrapper.post('api/onboarding').then(function (onboardingStates) {
                onboarding.isClosed(!_.isNullOrUndefined(onboardingStates) ? onboardingStates.isClosed : true);

                if (onboarding.isClosed()) {
                    return;
                }

                _.each(tasks, function (taskInitializer) {
                    var task = taskInitializer(onboardingStates);

                    task.isHintVisible = ko.observable(false);
                    task.showHint = function () {
                        closeAllHints();
                        task.isHintVisible(true);
                    };
                    task.closeHint = function () {
                        task.isHintVisible(false);
                    };

                    task.markedAsNext = ko.observable(false);
                    task.markAsNext = function () {
                        _.each(tasksList, function (item) {
                            item.markedAsNext(false);
                        });
                        task.markedAsNext(true);
                    };

                    task.isCompleted.subscribe(function (newValue) {
                        if (newValue) {
                            this.dispose();
                            openFirstUncompletedTaskHint();
                            markFirstUncompletedTaskAsNext();
                        }
                    });

                    tasksList.push(task);
                });

                markFirstUncompletedTaskAsNext();
            });
        }

        function openFirstUncompletedTaskHint() {
            _.every(tasksList, function (task) {
                if (!task.isCompleted()) {
                    task.showHint();
                    return false;
                }
                return true;
            });
        }

        function markFirstUncompletedTaskAsNext() {
            _.every(tasksList, function (task) {
                if (!task.isCompleted()) {
                    task.markAsNext();
                    return false;
                }
                return true;
            });
        }

        function closeAllHints() {
            _.each(tasksList, function (task) {
                task.closeHint(task);
            });
        }

        function closeOnboarding() {
            return apiHttpWrapper.post('api/onboarding/close').then(function () {
                onboarding.isClosed(true);
                app.trigger(constants.messages.onboarding.closed);
            });
        }

        function getTasksList() {
            return tasksList;
        }
    }
);