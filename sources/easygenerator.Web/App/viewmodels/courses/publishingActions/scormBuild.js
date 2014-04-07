define(['constants', 'viewmodels/courses/publishingActions/publishingAction', 'durandal/app', 'notify', 'eventTracker', 'repositories/courseRepository', 'dom'],
    function (constants, publishingAction, app, notify, eventTracker, repository, dom) {

        var
            events = {
                downloadScormCourse: 'Download SCORM 1.2 course'
            };

        var ctor = function (courseId, packageUrl) {
            var viewModel = publishingAction(courseId, packageUrl);

            viewModel.isPublishing = ko.computed(function () {
                return this.state() === constants.publishingStates.building;
            }, viewModel);

            viewModel.downloadCourse = function () {
                if (viewModel.isActive())
                    return undefined;

                viewModel.isActive(true);

                notify.hide();
                eventTracker.publish(events.downloadScormCourse);

                return repository.getById(viewModel.courseId).then(function (course) {
                    return course.scormBuild().then(function () {
                        dom.clickElementById('scormPackageLink');
                    }).fin(function () {
                        viewModel.isActive(false);
                    });
                });
            };

            //#region App-wide events

            viewModel.scromBuildStarted = function (course) {
                if (course.id !== viewModel.courseId)
                    return;

                viewModel.state(constants.publishingStates.building);
            }

            viewModel.scromBuildCompleted = function (course) {
                if (course.id !== viewModel.courseId)
                    return;

                viewModel.state(constants.publishingStates.succeed);
                viewModel.packageUrl(course.scormPackageUrl);
            }

            viewModel.scrormBuildFailed = function (id) {
                if (id !== viewModel.courseId)
                    return;

                viewModel.state(constants.publishingStates.failed);
                viewModel.packageUrl('');
            }

            app.on(constants.messages.course.scormBuild.started).then(viewModel.scromBuildStarted);
            app.on(constants.messages.course.scormBuild.completed).then(viewModel.scromBuildCompleted);
            app.on(constants.messages.course.scormBuild.failed).then(viewModel.scrormBuildFailed);

            //#endregion

            return viewModel;
        };

        return ctor;
    });