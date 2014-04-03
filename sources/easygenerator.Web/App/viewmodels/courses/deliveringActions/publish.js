define(['constants', 'viewmodels/courses/deliveringActions/deliveringAction', 'durandal/app', 'notify', 'eventTracker', 'repositories/courseRepository', 'plugins/router'],
    function (constants, deliveringAction, app, notify, eventTracker, repository, router) {

        var events = {
            publishCourse: 'Publish course'
        };

        var ctor = function (courseId, packageUrl) {

            var viewModel = deliveringAction(courseId, packageUrl);

            viewModel.state(!_.isNullOrUndefined(packageUrl) ? constants.deliveringStates.succeed : constants.deliveringStates.failed);

            viewModel.isDelivering = ko.computed(function () {
                return this.state() === constants.deliveringStates.building || this.state() === constants.deliveringStates.publishing;
            }, viewModel);

            viewModel.publishCourse = function () {
                if (viewModel.isActive())
                    return undefined;

                viewModel.isActive(true);

                notify.hide();
                eventTracker.publish(events.publishCourse);

                return repository.getById(viewModel.courseId).then(function (course) {
                    return course.publish().fin(function () {
                        viewModel.isActive(false);
                    });
                });
            };

            viewModel.openPublishedCourse = function () {
                if (viewModel.state() === constants.deliveringStates.succeed) {
                    router.openUrl(viewModel.packageUrl());
                }
            };

            //#region App-wide events


            viewModel.courseBuildStarted = function (course) {
                if (course.id !== viewModel.courseId || !viewModel.isActive())
                    return;

                viewModel.state(constants.deliveringStates.building);
            }

            viewModel.courseBuildFailed = function (courseid) {
                if (courseid !== viewModel.courseId || !viewModel.isActive())
                    return;

                viewModel.state(constants.deliveringStates.failed);
                viewModel.packageUrl('');
            }

            viewModel.coursePublishStarted = function (course) {
                if (course.id !== viewModel.courseId)
                    return;

                viewModel.state(constants.deliveringStates.publishing);
            }

            viewModel.coursePublishCompleted = function (course) {
                if (course.id !== viewModel.courseId)
                    return;

                viewModel.state(constants.deliveringStates.succeed);
                viewModel.packageUrl(course.publishedPackageUrl);
            }

            viewModel.coursePublishFailed = function (courseid) {
                if (courseid !== viewModel.courseId)
                    return;

                viewModel.state(constants.deliveringStates.failed);
                viewModel.packageUrl('');
            }

            app.on(constants.messages.course.build.started).then(viewModel.courseBuildStarted);
            app.on(constants.messages.course.build.failed).then(viewModel.courseBuildFailed);

            app.on(constants.messages.course.publish.started).then(viewModel.coursePublishStarted);
            app.on(constants.messages.course.publish.completed).then(viewModel.coursePublishCompleted);
            app.on(constants.messages.course.publish.failed).then(viewModel.coursePublishFailed);

            //#endregion

            return viewModel;
        };

        return ctor;
    });