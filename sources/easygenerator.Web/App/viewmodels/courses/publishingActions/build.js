define(['constants', 'viewmodels/courses/publishingActions/publishingAction', 'durandal/app', 'notify', 'eventTracker', 'fileHelper', 'plugins/router'],
    function (constants, publishingAction, app, notify, eventTracker, fileHelper, router) {

        var
           events = {
               downloadCourse: 'Download course'
           };

        var ctor = function (course) {

            var viewModel = publishingAction(course, course.build);

            viewModel.isPublishing = ko.computed(function () {
                return this.state() === constants.publishingStates.building;
            }, viewModel);

            viewModel.downloadCourse = downloadCourse;

            viewModel.courseBuildStarted = courseBuildStarted;
            viewModel.courseBuildFailed = courseBuildFailed;
            viewModel.courseBuildCompleted = courseBuildCompleted;

            app.on(constants.messages.course.build.started, viewModel.courseBuildStarted);
            app.on(constants.messages.course.build.completed, viewModel.courseBuildCompleted);
            app.on(constants.messages.course.build.failed, viewModel.courseBuildFailed);

            return viewModel;


            function downloadCourse() {
                if (viewModel.isCourseDelivering())
                    return undefined;

                notify.hide();
                eventTracker.publish(events.downloadCourse);

                return course.build().then(function (courseInfo) {
                    fileHelper.downloadFile('download/' + courseInfo.build.packageUrl);
                }).fail(function (message) {
                    notify.error(message);
                });
            };

            //#region App-wide events

            function courseBuildStarted(course) {
                if (course.id !== viewModel.courseId || course.build.state !== constants.publishingStates.building)
                    return;

                viewModel.state(constants.publishingStates.building);
            };

            function courseBuildFailed(course) {
                if (course.id !== viewModel.courseId || course.build.state !== constants.publishingStates.failed)
                    return;

                viewModel.state(constants.publishingStates.failed);
                viewModel.packageUrl('');
            };

            function courseBuildCompleted(course) {
                if (course.id !== viewModel.courseId || course.build.state !== constants.publishingStates.succeed)
                    return;

                viewModel.state(constants.publishingStates.succeed);
                viewModel.packageUrl(course.build.packageUrl);
            };

            //#endregion

        };

        return ctor;
    });