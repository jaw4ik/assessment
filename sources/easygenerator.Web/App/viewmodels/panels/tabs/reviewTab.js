define(['constants', 'durandal/app', 'notify', 'eventTracker', 'repositories/courseRepository', 'plugins/router', 'clientContext'],
    function (constants, app, notify, eventTracker, repository, router, clientContext) {

        var events = {
            updateCourseForReview: 'Update course for review'
        };

        var viewModel = {
            title: 'Review',
            activate: activate,
            canActivate: canActivate,
            reviewUrl: ko.observable(),
            state: ko.observable(),
            states: constants.deliveringStates,
            openCourseReviewUrl: openCourseReviewUrl,
            updateCourseForReview: updateCourseForReview,
            isActive: ko.observable(false),
            courseId: null
        };

        viewModel.isEnabled = ko.computed(function () {
            var activeInstruction = router.activeInstruction();
            if (_.isNullOrUndefined(activeInstruction)) {
                return false;
            }

            return activeInstruction.config.moduleId == 'viewmodels/courses/course';
        });

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

        function canActivate() {
            return viewModel.isEnabled();
        }

        function activate() {
            viewModel.courseId = clientContext.get('lastVistedCourse');
            return repository.getById(viewModel.courseId).then(function (course) {
                viewModel.reviewUrl(course.reviewUrl);
                viewModel.state(viewModel.reviewUrlExists() ? constants.deliveringStates.succeed : constants.deliveringStates.failed);
            }).fail(function (reason) {
                router.activeItem.settings.lifecycleData = { redirect: '404' };
                throw reason;
            });
        }
    }
);