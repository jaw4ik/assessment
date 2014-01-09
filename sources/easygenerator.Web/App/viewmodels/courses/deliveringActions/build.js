define(['constants', 'viewmodels/courses/deliveringActions/deliveringAction', 'durandal/app', 'notify', 'eventTracker', 'repositories/courseRepository', 'dom'],
    function (constants, deliveringAction, app, notify, eventTracker, repository, dom) {

        var
           events = {
               downloadCourse: 'Download course'
           };

        var ctor = function (courseId, packageUrl) {

            var viewModel = deliveringAction(courseId, packageUrl);
            
            viewModel.isDelivering = ko.computed(function () {
                return this.state() === constants.deliveringStates.building;
            }, viewModel);

            viewModel.downloadCourse = function () {
                if (viewModel.isActive())
                    return undefined;
                
                viewModel.isActive(true);
                
                notify.hide();
                eventTracker.publish(events.downloadCourse);

                return repository.getById(viewModel.courseId).then(function (course) {
                    return course.build().then(function () {
                        dom.clickElementById('packageLink');
                    }).fin(function() {
                        viewModel.isActive(false);
                    });
                });
            };

            //#region App-wide events

            app.on(constants.messages.course.build.started).then(function (course) {
                if (course.id !== viewModel.courseId || !viewModel.isActive())
                    return;

                viewModel.state(constants.deliveringStates.building);
            });

            app.on(constants.messages.course.build.completed, function (course) {
                if (course.id !== viewModel.courseId || !viewModel.isActive())
                    return;

                viewModel.state(constants.deliveringStates.succeed);
                viewModel.packageUrl(course.packageUrl);
            });

            app.on(constants.messages.course.build.failed, function (courseid) {
                if (courseid !== viewModel.courseId || !viewModel.isActive())
                    return;

                viewModel.state(constants.deliveringStates.failed);
                viewModel.packageUrl('');
            });

            //#endregion

            return viewModel;
        };

        return ctor;
    });