define(['constants', 'viewmodels/courses/publishingActions/publishingAction', 'durandal/app', 'notify', 'eventTracker', 'fileHelper', 'repositories/courseRepository'],
    function (constants, publishingAction, app, notify, eventTracker, fileHelper, repository) {

        var
           events = {
               downloadCourse: 'Download course'
           };
        
        var viewModel = publishingAction(),
            baseActivate = viewModel.activate;

        viewModel.isPublishing = ko.computed(function () {
            return this.state() === constants.publishingStates.building;
        }, viewModel);

        viewModel.downloadCourse = downloadCourse;

        viewModel.courseBuildStarted = courseBuildStarted;
        viewModel.courseBuildFailed = courseBuildFailed;
        viewModel.courseBuildCompleted = courseBuildCompleted;
        viewModel.activate = activate;

        return viewModel;

        function activate(courseId) {
            return repository.getById(courseId).then(function (course) {
                baseActivate(course, course.build);

                viewModel.subscribe(constants.messages.course.build.started, viewModel.courseBuildStarted);
                viewModel.subscribe(constants.messages.course.build.completed, viewModel.courseBuildCompleted);
                viewModel.subscribe(constants.messages.course.build.failed, viewModel.courseBuildFailed);
            });
        }

        function downloadCourse() {
            if (viewModel.isCourseDelivering())
                return undefined;

            notify.hide();
            eventTracker.publish(events.downloadCourse);

            return repository.getById(viewModel.courseId).then(function (course) {
                return course.build().then(function (courseInfo) {
                    fileHelper.downloadFile('download/' + courseInfo.build.packageUrl);
                }).fail(function (message) {
                    notify.error(message);
                });
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

    });