define(['constants', 'durandal/app', 'notify', 'eventTracker', 'repositories/courseRepository', 'repositories/commentRepository', 'plugins/router', 'guard', 'userContext'],
    function (constants, app, notify, eventTracker, repository, commentRepository, router, guard, userContext) {

        var events = {
            updateCourseForReview: 'Update course for review',
            openReviewTab: 'Open review tab'
        };

        var viewModel = {
            activate: activate,
            reviewUrl: ko.observable(),
            state: ko.observable(),
            states: constants.publishingStates,
            openCourseReviewUrl: openCourseReviewUrl,
            updateCourseForReview: updateCourseForReview,
            isActive: ko.observable(false),
            courseId: null
        };

        viewModel.isPublishing = ko.computed(function () {
            return this.state() === constants.publishingStates.building || this.state() === constants.publishingStates.publishing;
        }, viewModel);

        viewModel.reviewUrlExists = ko.computed(function () {
            return !_.isNullOrUndefined(this.reviewUrl()) && !_.isEmptyOrWhitespace(this.reviewUrl());
        }, viewModel);

        //#region App-wide events

        app.on(constants.messages.course.build.started).then(function (course) {
            if (course.id !== viewModel.courseId || !viewModel.isActive())
                return;

            viewModel.state(constants.publishingStates.building);
        });

        app.on(constants.messages.course.build.failed, function (courseid) {
            if (courseid !== viewModel.courseId || !viewModel.isActive())
                return;

            viewModel.state(constants.publishingStates.failed);
        });

        app.on(constants.messages.course.publishForReview.started, function (course) {
            if (course.id !== viewModel.courseId)
                return;

            viewModel.state(constants.publishingStates.publishing);
        });

        app.on(constants.messages.course.publishForReview.completed, function (course) {
            if (course.id !== viewModel.courseId)
                return;

            viewModel.state(constants.publishingStates.succeed);
            viewModel.reviewUrl(course.reviewUrl);
        });

        app.on(constants.messages.course.publishForReview.failed, function (courseid) {
            if (courseid !== viewModel.courseId)
                return;

            viewModel.state(constants.publishingStates.failed);
        });

        //#endregion

        return viewModel;

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
                return course.publishForReview().fin(function () {
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