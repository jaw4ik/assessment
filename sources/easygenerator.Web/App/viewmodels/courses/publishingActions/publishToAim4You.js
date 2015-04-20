define(['localization/localizationManager', 'constants', 'dataContext', 'viewmodels/courses/publishingActions/publishingAction', 'eventTracker', 'notify', 'repositories/courseRepository'],
    function (localizationManager, constants, dataContext, publishingAction, eventTracker, notify, repository) {

        var events = {
            registerToAim4You: 'Register to Aim4You',
            publishToAim4You: 'Publish to Aim4You'
        };

        var ctor= function() {

            var viewModel = publishingAction(),
                baseActivate = viewModel.activate;

            viewModel.isPublishing = ko.computed(function() {
                return this.state() === constants.publishingStates.building
                    || this.state() === constants.publishingStates.publishing
                    || this.state() === constants.registerOnAim4YouStates.inProgress;
            }, viewModel);

            viewModel.infoMessageStates = {
                none: 'none',
                published: 'published'
            };

            viewModel.messageState = ko.observable(viewModel.infoMessageStates.none);
            viewModel.publishToAim4You = publishToAim4You;
            viewModel.activate = activate;

            viewModel.courseBuildStarted = courseBuildStarted;
            viewModel.courseBuildFailed = courseBuildFailed;
            viewModel.publishToAim4YouStarted = publishToAim4YouStarted;
            viewModel.publishToAim4YouCompleted = publishToAim4YouCompleted;
            viewModel.publishToAim4YouFailed = publishToAim4YouFailed;
            viewModel.initializeCourseDelivering = initializeCourseDelivering;

            return viewModel;

            function activate(courseId) {
                return repository.getById(courseId).then(function(course) {
                    baseActivate(course, course.publishToStore);

                    viewModel.subscribe(constants.messages.course.build.started, viewModel.courseBuildStarted);
                    viewModel.subscribe(constants.messages.course.build.failed, viewModel.courseBuildFailed);

                    viewModel.subscribe(constants.messages.course.publishToAim4You.started, viewModel.publishToAim4YouStarted);
                    viewModel.subscribe(constants.messages.course.publishToAim4You.completed, viewModel.publishToAim4YouCompleted);
                    viewModel.subscribe(constants.messages.course.publishToAim4You.failed, viewModel.publishToAim4YouFailed);
                    viewModel.subscribe(constants.messages.course.delivering.started, viewModel.initializeCourseDelivering);
                });
            }

            function publishToAim4You() {
                if (viewModel.isCourseDelivering()) {
                    return;
                }

                eventTracker.publish(events.publishToAim4You);

                return repository.getById(viewModel.courseId).then(function(course) {
                    return course.publishToStore().then(function() {
                        viewModel.messageState(viewModel.infoMessageStates.published);
                    }).fail(function(message) {
                        notify.error(message);
                    });
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

            function initializeCourseDelivering(course) {
                if (course.id !== viewModel.courseId) {
                    return;
                }
                viewModel.messageState = ko.observable(viewModel.infoMessageStates.none);
            };

            //#endregion
        }

        return ctor;
    });