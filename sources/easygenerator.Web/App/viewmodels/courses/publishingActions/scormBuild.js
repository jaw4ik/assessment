define(['constants', 'viewmodels/courses/publishingActions/publishingAction', 'durandal/app', 'notify', 'eventTracker', 'fileHelper', 'plugins/router', 'userContext', 'repositories/courseRepository'],
    function (constants, publishingAction, app, notify, eventTracker, fileHelper, router, userContext, repository) {

        var
            events = {
                downloadScormCourse: 'Download SCORM 1.2 course'
            };

        var ctor = function () {
            var viewModel = publishingAction(),
               baseActivate = viewModel.activate;

            viewModel.isPublishing = ko.computed(function () {
                return this.state() === constants.publishingStates.building;
            }, viewModel);

            viewModel.activate = activate;
            viewModel.downloadCourse = downloadCourse;
            viewModel.openUpgradePlanUrl = openUpgradePlanUrl;
            viewModel.userHasPublishAccess = userContext.hasStarterAccess();

            viewModel.scromBuildStarted = scromBuildStarted;
            viewModel.scromBuildCompleted = scromBuildCompleted;
            viewModel.scrormBuildFailed = scrormBuildFailed;

            return viewModel;

            function activate(courseId) {
                return repository.getById(courseId).then(function (course) {
                    baseActivate(course, course.scormBuild);

                    viewModel.subscribe(constants.messages.course.scormBuild.started, viewModel.scromBuildStarted);
                    viewModel.subscribe(constants.messages.course.scormBuild.completed, viewModel.scromBuildCompleted);
                    viewModel.subscribe(constants.messages.course.scormBuild.failed, viewModel.scrormBuildFailed);
                });
            }

            function downloadCourse() {
                if (viewModel.isCourseDelivering())
                    return undefined;

                eventTracker.publish(events.downloadScormCourse);

                return repository.getById(viewModel.courseId).then(function (course) {
                    return course.scormBuild().then(function (courseInfo) {
                        fileHelper.downloadFile('download/' + courseInfo.scormBuild.packageUrl);
                    }).fail(function (message) {
                        notify.error(message);
                    });
                });
            };

            function openUpgradePlanUrl() {
                eventTracker.publish(constants.upgradeEvent, constants.upgradeCategory.scorm);
                router.openUrl(constants.upgradeUrl);
            }

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