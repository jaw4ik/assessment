define(['onboarding/inititalization'], function (inititalization) {
    "use strict";

    var viewModel = {
        tasks: ko.observableArray([]),
        isMinimized: ko.observable(false),

        close: close,
        activate: activate
    };

    viewModel.isCompleted = ko.computed(function () {
        return _.every(viewModel.tasks(), function (task) {
            return task.isCompleted();
        });
    });

    return viewModel;

    function activate(settings) {
        viewModel.tasks(inititalization.getTasksList());
        viewModel.isMinimized(settings.isMinimized);
    }

    function close() {
        inititalization.close();
    }
})