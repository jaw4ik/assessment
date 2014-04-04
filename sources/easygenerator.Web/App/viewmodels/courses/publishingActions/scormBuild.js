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

            app.on(constants.messages.course.scormBuild.started).then(function (course) {
                if (course.id !== viewModel.courseId)
                    return;

                viewModel.state(constants.publishingStates.building);
            });

            app.on(constants.messages.course.scormBuild.completed, function (course) {
                if (course.id !== viewModel.courseId)
                    return;

                viewModel.state(constants.publishingStates.succeed);
                viewModel.packageUrl(course.scormPackageUrl);
            });

            app.on(constants.messages.course.scormBuild.failed, function (courseid) {
                if (courseid !== viewModel.courseId)
                    return;

                viewModel.state(constants.publishingStates.failed);
                viewModel.packageUrl('');
            });

            //#endregion

            return viewModel;
        };

        return ctor;
    });