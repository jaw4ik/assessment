define(['constants', 'viewmodels/courses/publishingActions/publishingAction', 'durandal/app', 'notify', 'eventTracker', 'plugins/router'],
    function (constants, publishingAction, app, notify, eventTracker, router) {

        var events = {
            publishCourse: 'Publish course'
        };

        var ctor = function (course, eventCategory) {

            var viewModel = publishingAction(course, course.publish);

            viewModel.isPublishing = ko.computed(function () {
                return this.state() === constants.publishingStates.building || this.state() === constants.publishingStates.publishing;
            }, viewModel);

            viewModel.publishCourse = publishCourse;
            viewModel.openPublishedCourse = openPublishedCourse;
            viewModel.eventCategory = eventCategory;

            viewModel.courseBuildStarted = courseBuildStarted;
            viewModel.courseBuildFailed = courseBuildFailed;
            viewModel.coursePublishStarted = coursePublishStarted;
            viewModel.coursePublishCompleted = coursePublishCompleted;
            viewModel.coursePublishFailed = coursePublishFailed;

            app.on(constants.messages.course.build.started).then(viewModel.courseBuildStarted);
            app.on(constants.messages.course.build.failed).then(viewModel.courseBuildFailed);

            app.on(constants.messages.course.publish.started).then(viewModel.coursePublishStarted);
            app.on(constants.messages.course.publish.completed).then(viewModel.coursePublishCompleted);
            app.on(constants.messages.course.publish.failed).then(viewModel.coursePublishFailed);

            return viewModel;

            function publishCourse() {
                if (viewModel.isCourseDelivering())
                    return undefined;

                eventTracker.publish(events.publishCourse, viewModel.eventCategory);

                return course.publish().fail(function (message) {
                    notify.error(message);
                });
            };

            function openPublishedCourse() {
                if (viewModel.packageExists()) {
                    router.openUrl(viewModel.packageUrl());
                }
            };

            //#region App-wide events

            function courseBuildStarted(course) {
                if (course.id !== viewModel.courseId || course.publish.state !== constants.publishingStates.building)
                    return;

                viewModel.state(constants.publishingStates.building);
            };

            function courseBuildFailed(course) {
                if (course.id !== viewModel.courseId || course.publish.state !== constants.publishingStates.failed)
                    return;

                viewModel.state(constants.publishingStates.failed);
                viewModel.packageUrl('');
            };

            function coursePublishStarted(course) {
                if (course.id !== viewModel.courseId)
                    return;

                viewModel.state(constants.publishingStates.publishing);
            };

            function coursePublishCompleted(course) {
                if (course.id !== viewModel.courseId)
                    return;

                viewModel.state(constants.publishingStates.succeed);
                viewModel.packageUrl(course.publish.packageUrl);
            };

            function coursePublishFailed(course) {
                if (course.id !== viewModel.courseId)
                    return;

                viewModel.state(constants.publishingStates.failed);
                viewModel.packageUrl('');
            };

            //#endregion

        };

        return ctor;
    });