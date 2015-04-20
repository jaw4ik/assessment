define(['constants', 'durandal/app'], function (constants, app) {

    var ctor = function () {
        var viewModel = {
            state: ko.observable(),
            packageUrl: ko.observable(),
            states: constants.publishingStates,
            isCourseDelivering: ko.observable(false),
            courseId: '',
            subscriptions: [],
            subscribe: subscribe,
            courseDeliveringStarted: courseDeliveringStarted,
            courseDeliveringFinished: courseDeliveringFinished,
            activate: activate,
            deactivate: deactivate
        };

        viewModel.packageExists = ko.computed(function () {
            return !_.isNullOrUndefined(this.packageUrl()) && !_.isEmptyOrWhitespace(this.packageUrl());
        }, viewModel);

        return viewModel;

        function activate(course, action) {
            viewModel.state(action.state);
            viewModel.packageUrl(action.packageUrl);
            viewModel.isCourseDelivering(course.isDelivering);
            viewModel.courseId = course.id;

            clearSubscriptions();
            subscribe(constants.messages.course.delivering.started, viewModel.courseDeliveringStarted);
            subscribe(constants.messages.course.delivering.finished, viewModel.courseDeliveringFinished);
        }

        function deactivate() {
            _.each(viewModel.subscriptions, function (subscription) {
                subscription.off();
            });

            clearSubscriptions();
        }

        function courseDeliveringStarted(course) {
            if (course.id !== viewModel.courseId) {
                return;
            }

            viewModel.isCourseDelivering(true);
        }

        function courseDeliveringFinished(course) {
            if (course.id !== viewModel.courseId) {
                return;
            }

            viewModel.isCourseDelivering(false);
        }

        function subscribe(eventName, handler) {
            viewModel.subscriptions.push(app.on(eventName).then(handler));
        }

        function clearSubscriptions() {
            viewModel.subscriptions.splice(0, viewModel.subscriptions.length);
        }
    };

    return ctor;
});