define(['localization/localizationManager', 'constants', 'dataContext', 'viewmodels/courses/publishingActions/publishingAction', 'eventTracker', 'notify', 'durandal/app', 'userContext'],
    function (localizationManager, constants, dataContext, publishingAction, eventTracker, notify, app, userContext) {

        var events = {
            registerToAim4You: 'Register to Aim4You',
            publishToAim4You: 'Publish to Aim4You'
        };

        var ctor = function (course) {
            var viewModel = publishingAction(course.id, course.publishToStore);

            viewModel.isPublishing = ko.computed(function () {
                return this.state() === constants.publishingStates.building
                    || this.state() === constants.publishingStates.publishing
                    || this.state() === constants.registerOnAim4YouStates.inProgress;
            }, viewModel);

            viewModel.infoMessageStates = {
                none: 'none',
                published: 'published'
            };

            viewModel.messageState = ko.observable(viewModel.infoMessageStates.none);
            viewModel.isTryMode = !_.isObject(userContext.identity);
            viewModel.publishToAim4You = publishToAim4You;

            viewModel.courseBuildStarted = courseBuildStarted;
            viewModel.courseBuildFailed = courseBuildFailed;
            viewModel.publishToAim4YouStarted = publishToAim4YouStarted;
            viewModel.publishToAim4YouCompleted = publishToAim4YouCompleted;
            viewModel.publishToAim4YouFailed = publishToAim4YouFailed;
            viewModel.courseActionStarted = courseActionStarted;

            app.on(constants.messages.course.build.started).then(viewModel.courseBuildStarted);
            app.on(constants.messages.course.build.failed).then(viewModel.courseBuildFailed);

            app.on(constants.messages.course.publishToAim4You.started).then(viewModel.publishToAim4YouStarted);
            app.on(constants.messages.course.publishToAim4You.completed).then(viewModel.publishToAim4YouCompleted);
            app.on(constants.messages.course.publishToAim4You.failed).then(viewModel.publishToAim4YouFailed);
            app.on(constants.messages.course.action.started).then(viewModel.courseActionStarted);

            return viewModel;


            function publishToAim4You() {
                if (viewModel.isActive()) {
                    return;
                }

                viewModel.isActive(true);
                notify.hide();
                eventTracker.publish(events.publishToAim4You);

                return course.publishToStore().then(function () {
                    viewModel.messageState(viewModel.infoMessageStates.published);
                }).fail(function (message) {
                    notify.error(message);
                }).fin(function () {
                    viewModel.isActive(false);
                });
            };

            //#region App-wide events

            function courseBuildStarted(course) {
                if (course.id !== viewModel.courseId || course.publishToStore.state != constants.publishingStates.building) {
                    return;
                }
                viewModel.state(constants.publishingStates.building);
            };

            function courseBuildFailed(course) {
                if (course.id !== viewModel.courseId || course.publishToStore.state != constants.publishingStates.failed) {
                    return;
                }
                viewModel.state(constants.publishingStates.failed);
            };

            function publishToAim4YouStarted(course) {
                if (course.id !== viewModel.courseId) {
                    return;
                }
                viewModel.state(constants.publishingStates.publishing);
            };

            function publishToAim4YouCompleted(course) {
                if (course.id !== viewModel.courseId) {
                    return;
                }
                viewModel.state(constants.publishingStates.succeed);
            };

            function publishToAim4YouFailed(course) {
                if (course.id !== viewModel.courseId) {
                    return;
                }
                viewModel.state(constants.publishingStates.failed);
            };

            function courseActionStarted(course) {
                if (course.id !== viewModel.courseId) {
                    return;
                }
                viewModel.messageState = ko.observable(viewModel.infoMessageStates.none);
            };

            //#endregion

        };

        return ctor;

    });