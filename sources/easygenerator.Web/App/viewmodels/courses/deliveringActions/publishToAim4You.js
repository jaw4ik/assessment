define(['localization/localizationManager','constants', 'dataContext', 'viewmodels/courses/deliveringActions/deliveringAction', 'eventTracker', 'services/aim4YouService', 'repositories/courseRepository', 'notify', 'durandal/app', 'userContext'],
    function (localizationManager, constants, dataContext, deliveringAcion, eventTracker, aim4YouService, courseRepository, notify, app, userContext) {

        var events = {
            registerToAim4You: 'Register to Aim4You',
            publishToAim4You: 'Publish to Aim4You'
        };

        var ctor = function(courseId) {
            var viewModel = deliveringAcion(courseId);

            viewModel.isDelivering = ko.computed(function() {
                return this.state() === constants.deliveringStates.building
                    || this.state() === constants.deliveringStates.publishing
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
                if (viewModel.isDelivering() || viewModel.isRegisteredOnAim4You()) {
                    return;
                }
                
                notify.hide();
                eventTracker.publish(events.registerToAim4You);
                viewModel.state(constants.registerOnAim4YouStates.inProgress);

                return aim4YouService.register().then(function() {
                    viewModel.state(constants.registerOnAim4YouStates.success);
                    viewModel.isRegisteredOnAim4You(true);
                    viewModel.messageState(viewModel.infoMessageStates.registered);
                }).fail(function () {
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

            app.on(constants.messages.course.build.started).then(function (course) {
                if (course.id !== viewModel.courseId || !viewModel.isActive()) {
                    return;
                }
                viewModel.state(constants.deliveringStates.building);
            });

            app.on(constants.messages.course.build.failed, function (courseid) {
                if (courseid !== viewModel.courseId || !viewModel.isActive()) {
                    return;
                }
                viewModel.state(constants.deliveringStates.failed);
            });

            app.on(constants.messages.course.publishToAim4You.started).then(function (course) {
                if (course.id !== viewModel.courseId) {
                    return;
                }
                viewModel.state(constants.deliveringStates.publishing);
            });

            app.on(constants.messages.course.publishToAim4You.completed, function (course) {
                if (course.id !== viewModel.courseId) {
                    return;
                }
                viewModel.state(constants.deliveringStates.succeed);
            });

            app.on(constants.messages.course.publishToAim4You.failed, function (courseid) {
                if (courseid !== viewModel.courseId) {
                    return;
                }
                viewModel.state(constants.deliveringStates.failed);
            });
            
            app.on(constants.messages.course.action.started, function (courseid) {
                if (courseid !== viewModel.courseId) {
                    return;
                }
                viewModel.messageState = ko.observable(viewModel.infoMessageStates.none);
            });
            
            //#endregion

            return viewModel;
        };

        return ctor;

    });