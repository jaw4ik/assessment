define(['constants', 'durandal/app', 'notify', 'eventTracker', 'repositories/courseRepository', 'plugins/router', 'guard'],
    function (constants, app, notify, eventTracker, repository, router, guard) {

        var events = {
            updateCourseForReview: 'Update course for review',
            openReviewTab: 'Open review tab'
        };

        var viewModel = {
            activate: activate,
            reviewUrl: ko.observable(),
            state: ko.observable(),
            states: constants.deliveringStates,
            openCourseReviewUrl: openCourseReviewUrl,
            updateCourseForReview: updateCourseForReview,
            isActive: ko.observable(false),
            courseId: null
        };

        viewModel.isDelivering = ko.computed(function () {
            return this.state() === constants.deliveringStates.building || this.state() === constants.deliveringStates.publishing;
        }, viewModel);

        viewModel.reviewUrlExists = ko.computed(function () {
            return !_.isNullOrUndefined(this.reviewUrl()) && !_.isEmptyOrWhitespace(this.reviewUrl());
        }, viewModel);

        //#region App-wide events

        app.on(constants.messages.course.build.started).then(function (course) {
            if (course.id !== viewModel.courseId || !viewModel.isActive())
                return;

            viewModel.state(constants.deliveringStates.building);
        });

        app.on(constants.messages.course.build.failed, function (courseid) {
            if (courseid !== viewModel.courseId || !viewModel.isActive())
                return;

            viewModel.state(constants.deliveringStates.failed);
        });

        app.on(constants.messages.course.publishForReview.started, function (course) {
            if (course.id !== viewModel.courseId)
                return;

            viewModel.state(constants.deliveringStates.publishing);
        });

        app.on(constants.messages.course.publishForReview.completed, function (course) {
            if (course.id !== viewModel.courseId)
                return;

            viewModel.state(constants.deliveringStates.succeed);
            viewModel.reviewUrl(course.reviewUrl);
        });

        app.on(constants.messages.course.publishForReview.failed, function (courseid) {
            if (courseid !== viewModel.courseId)
                return;

            viewModel.state(constants.deliveringStates.failed);
        });

        //#endregion

        return viewModel;

        function openCourseReviewUrl() {
            if (viewModel.reviewUrlExists()) {
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
            return Q.fcall(function() {
                guard.throwIfNotAnObject(dataPromise, 'Activation data promise is not an object');

                return dataPromise.then(function(data) {
                    guard.throwIfNotAnObject(data, 'Activation data is not an object');
                    guard.throwIfNotString(data.courseId, 'Course id is not a string');

                    eventTracker.publish(events.openReviewTab);
                    viewModel.courseId = data.courseId;
                    viewModel.reviewUrl(data.reviewUrl);
                    viewModel.state(viewModel.reviewUrlExists() ? constants.deliveringStates.succeed : constants.deliveringStates.failed);
                });
            });
        }
    }
);