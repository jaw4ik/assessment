define(['localization/localizationManager', 'constants', 'dataContext', 'viewmodels/courses/publishingActions/publishingAction', 'eventTracker', 'services/aim4YouService', 'repositories/courseRepository', 'notify', 'durandal/app', 'userContext'],
    function (localizationManager, constants, dataContext, publishingAction, eventTracker, aim4YouService, courseRepository, notify, app, userContext) {

        var events = {
            registerToAim4You: 'Register to Aim4You',
            publishToAim4You: 'Publish to Aim4You'
        };

        var ctor = function (courseId) {
            var viewModel = publishingAction(courseId);

            viewModel.isPublishing = ko.computed(function () {
                return this.state() === constants.publishingStates.building
                    || this.state() === constants.publishingStates.publishing
                    || this.state() === constants.registerOnAim4YouStates.inProgress;
            }, viewModel);

            viewModel.infoMessageStates = {
                none: 'none',
                registered: 'registered',
                published: 'published'
            };

            viewModel.messageState = ko.observable(viewModel.infoMessageStates.none);

            viewModel.isTryMode = !_.isObject(userContext.identity);

            viewModel.isRegisteredOnAim4You = ko.observable(dataContext.userSettings.isRegisteredOnAim4You);

            viewModel.register = function () {
                if (viewModel.isPublishing() || viewModel.isRegisteredOnAim4You()) {
                    return;
                }

                notify.hide();
                eventTracker.publish(events.registerToAim4You);
                viewModel.state(constants.registerOnAim4YouStates.inProgress);

                return aim4YouService.register().then(function () {
                    viewModel.state(constants.registerOnAim4YouStates.success);
                    viewModel.isRegisteredOnAim4You(true);
                    viewModel.messageState(viewModel.infoMessageStates.registered);
                }).fail(function (message) {
                    app.trigger(constants.messages.course.publishToAim4You.failed, courseId, message);
                    viewModel.state(constants.registerOnAim4YouStates.fail);
                });
            };

            viewModel.publishToAim4You = function () {
                if (viewModel.isActive()) {
                    return;
                }

                viewModel.isActive(true);
                notify.hide();
                eventTracker.publish(events.publishToAim4You);

                return courseRepository.getById(courseId).then(function (course) {
                    return course.publishToStore().then(function () {
                        viewModel.messageState(viewModel.infoMessageStates.published);
                    }).fin(function () {
                        viewModel.isActive(false);
                    });
                });
            };

            //#region App-wide events

            viewModel.courseBuildStarted = function (course) {
                if (course.id !== viewModel.courseId || !viewModel.isActive()) {
                    return;
                }
                viewModel.state(constants.publishingStates.building);
            }

            viewModel.courseBuildFailed = function (courseid) {
                if (courseid !== viewModel.courseId || !viewModel.isActive()) {
                    return;
                }
                viewModel.state(constants.publishingStates.failed);
            }

            viewModel.publishToAim4YouStarted = function (course) {
                if (course.id !== viewModel.courseId) {
                    return;
                }
                viewModel.state(constants.publishingStates.publishing);
            }

            viewModel.publishToAim4YouCompleted = function (course) {
                if (course.id !== viewModel.courseId) {
                    return;
                }
                viewModel.state(constants.publishingStates.succeed);
            }

            viewModel.publishToAim4YouFailed = function (courseid) {
                if (courseid !== viewModel.courseId) {
                    return;
                }
                viewModel.state(constants.publishingStates.failed);
            }

            viewModel.courseActionStarted = function (courseid) {
                if (courseid !== viewModel.courseId) {
                    return;
                }
                viewModel.messageState = ko.observable(viewModel.infoMessageStates.none);
            }

            app.on(constants.messages.course.build.started).then(viewModel.courseBuildStarted);
            app.on(constants.messages.course.build.failed).then(viewModel.courseBuildFailed);
            app.on(constants.messages.course.publishToAim4You.started).then(viewModel.publishToAim4YouStarted);
            app.on(constants.messages.course.publishToAim4You.completed).then(viewModel.publishToAim4YouCompleted);
            app.on(constants.messages.course.publishToAim4You.failed).then(viewModel.publishToAim4YouFailed);
            app.on(constants.messages.course.action.started).then(viewModel.courseActionStarted);

            //#endregion

            return viewModel;
        };

        return ctor;

    });