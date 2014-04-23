define(['constants', 'viewmodels/courses/publishingActions/publishingAction', 'durandal/app', 'notify', 'eventTracker', 'fileHelper'],
    function (constants, publishingAction, app, notify, eventTracker, fileHelper) {

        var
            events = {
                downloadScormCourse: 'Download SCORM 1.2 course'
            };

        var ctor = function (course) {
            var viewModel = publishingAction(course.id, course.scormBuild);

            viewModel.isPublishing = ko.computed(function () {
                return this.state() === constants.publishingStates.building;
            }, viewModel);

            viewModel.downloadCourse = downloadCourse;

            viewModel.scromBuildStarted = scromBuildStarted;
            viewModel.scromBuildCompleted = scromBuildCompleted;
            viewModel.scrormBuildFailed = scrormBuildFailed;

            app.on(constants.messages.course.scormBuild.started).then(viewModel.scromBuildStarted);
            app.on(constants.messages.course.scormBuild.completed).then(viewModel.scromBuildCompleted);
            app.on(constants.messages.course.scormBuild.failed).then(viewModel.scrormBuildFailed);

            return viewModel;


            function downloadCourse() {
                if (viewModel.isActive())
                    return undefined;

                viewModel.isActive(true);

                notify.hide();
                eventTracker.publish(events.downloadScormCourse);

                return course.scormBuild().then(function (courseInfo) {
                    fileHelper.downloadFile('download/' + courseInfo.scormBuild.packageUrl);
                }).fail(function (message) {
                    notify.error(message);
                }).fin(function () {
                    viewModel.isActive(false);
                });
            };

            //#region App-wide events

            function scromBuildStarted(course) {
                if (course.id !== viewModel.courseId)
                    return;

                viewModel.state(constants.publishingStates.building);
            };

            function scromBuildCompleted(course) {
                if (course.id !== viewModel.courseId)
                    return;

                viewModel.state(constants.publishingStates.succeed);
                viewModel.packageUrl(course.scormBuild.packageUrl);
            };

            function scrormBuildFailed(course) {
                if (course.id !== viewModel.courseId)
                    return;

                viewModel.state(constants.publishingStates.failed);
                viewModel.packageUrl('');
            };

            //#endregion

        };

        return ctor;
    });