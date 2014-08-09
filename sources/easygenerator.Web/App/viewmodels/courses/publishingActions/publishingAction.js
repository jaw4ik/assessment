define(['constants', 'durandal/app'], function (constants, app) {

    var ctor = function (course, action) {
        var viewModel = {
            state: ko.observable(action.state),
            packageUrl: ko.observable(action.packageUrl),
            isPublishing: ko.observable(false),
            isCourseDelivering: ko.observable(course.isDelivering),
            courseId: course.id,
            courseDeliveringStarted: courseDeliveringStarted,
            courseDeliveringFinished: courseDeliveringFinished
        };

        app.on(constants.messages.course.delivering.started).then(viewModel.courseDeliveringStarted);
        app.on(constants.messages.course.delivering.finished).then(viewModel.courseDeliveringFinished);

        viewModel.packageExists = ko.computed(function () {
            return !_.isNullOrUndefined(this.packageUrl()) && !_.isEmptyOrWhitespace(this.packageUrl());
        }, viewModel);

        return viewModel;

        function courseDeliveringStarted(course) {
            if (course.id !== viewModel.courseId) {
                return;
            }

            viewModel.isCourseDelivering(true);
        };

        function courseDeliveringFinished(course) {
            if (course.id !== viewModel.courseId) {
                return;
            }

            viewModel.isCourseDelivering(false);
        };
    };

    return ctor;
});