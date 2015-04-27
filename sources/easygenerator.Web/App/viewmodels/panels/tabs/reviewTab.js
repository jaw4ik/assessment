define(['constants', 'durandal/app', 'notify', 'eventTracker', 'repositories/courseRepository', 'repositories/commentRepository', 'plugins/router', 'guard', 'userContext'],
    function (constants, app, notify, eventTracker, repository, commentRepository, router, guard, userContext) {

        var events = {
            updateCourseForReview: 'Update course for review',
            openReviewTab: 'Open review tab'
        };

        var viewModel = {
            states: constants.publishingStates,

            courseId: null,
            reviewUrl: ko.observable(),
            state: ko.observable(),
            isActive: ko.observable(false),

            activate: activate,
            openCourseReviewUrl: openCourseReviewUrl,
            updateCourseForReview: updateCourseForReview,

            courseBuildStarted: courseBuildStarted,
            courseBuildFailed: courseBuildFailed,
            coursePublishForReviewStarted: coursePublishForReviewStarted,
            coursePublishForReviewCompleted: coursePublishForReviewCompleted,
            coursePublishForReviewFailed: coursePublishForReviewFailed
        };

        viewModel.isPublishing = ko.computed(function () {
            return this.state() === constants.publishingStates.building || this.state() === constants.publishingStates.publishing;
        }, viewModel);

        viewModel.reviewUrlExists = ko.computed(function () {
            return !_.isNullOrUndefined(this.reviewUrl()) && !_.isEmptyOrWhitespace(this.reviewUrl());
        }, viewModel);

        app.on(constants.messages.course.build.started).then(viewModel.courseBuildStarted);
        app.on(constants.messages.course.build.failed).then(viewModel.courseBuildFailed);
        app.on(constants.messages.course.publishForReview.started).then(viewModel.coursePublishForReviewStarted);
        app.on(constants.messages.course.publishForReview.completed).then(viewModel.coursePublishForReviewCompleted);
        app.on(constants.messages.course.publishForReview.failed).then(viewModel.coursePublishForReviewFailed);

        return viewModel;


        //#region App-wide events

        function courseBuildStarted(course) {
            if (course.id !== viewModel.courseId || course.publishForReview.state != constants.publishingStates.building)
                return;

            viewModel.state(constants.publishingStates.building);
        };

        function courseBuildFailed(course) {
            if (course.id !== viewModel.courseId || course.publishForReview.state != constants.publishingStates.failed)
                return;

            viewModel.state(constants.publishingStates.failed);
        };

        function coursePublishForReviewStarted(course) {
            if (course.id !== viewModel.courseId)
                return;

            viewModel.state(constants.publishingStates.publishing);
        };

        function coursePublishForReviewCompleted(course) {
            if (course.id !== viewModel.courseId)
                return;

            viewModel.state(constants.publishingStates.succeed);
            viewModel.reviewUrl(course.publishForReview.packageUrl);
        };

        function coursePublishForReviewFailed(course) {
            if (course.id !== viewModel.courseId)
                return;

            viewModel.state(constants.publishingStates.failed);
        };

        //#endregion

        function openCourseReviewUrl() {
            if (viewModel.reviewUrlExists() && !viewModel.isPublishing()) {
                router.openUrl(viewModel.reviewUrl());
            }
        }

        function updateCourseForReview() {
            if (viewModel.isActive())
                return undefined;

            viewModel.isActive(true);

            eventTracker.publish(events.updateCourseForReview);

            return repository.getById(viewModel.courseId).then(function (course) {
                return course.publishForReview().fail(function (message) {
                    notify.error(message);
                }).fin(function () {
                    viewModel.isActive(false);
                });
            });
        }

        function activate(dataPromise) {
            return Q.fcall(function () {
                guard.throwIfNotAnObject(dataPromise, 'Activation data promise is not an object');

                return dataPromise.then(function (data) {
                    guard.throwIfNotAnObject(data, 'Activation data is not an object');
                    guard.throwIfNotString(data.courseId, 'Course id is not a string');

                    eventTracker.publish(events.openReviewTab);

                    viewModel.courseId = data.courseId;
                    viewModel.reviewUrl(data.reviewUrl);
                    viewModel.state(viewModel.reviewUrlExists() ? constants.publishingStates.succeed : constants.publishingStates.failed);
                });
            });
        }
    }
);