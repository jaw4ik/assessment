define(['repositories/courseRepository', 'plugins/router', 'constants', 'viewmodels/courses/publishingActions/build',
        'viewmodels/courses/publishingActions/scormBuild', 'viewmodels/courses/publishingActions/publish', 'userContext',
        'viewmodels/courses/publishingActions/publishToAim4You', 'clientContext', 'localization/localizationManager', 'eventTracker', 'durandal/app'],
    function (repository, router, constants, buildPublishingAction, scormBuildPublishingAction, publishPublishingAction, userContext, publishToAim4You,
        clientContext, localizationManager, eventTracker, app) {

        var events = {
            navigateToCourses: 'Navigate to courses'
        };

        var viewModel = {
            courseId: '',
            states: constants.publishingStates,

            buildAction: ko.observable(),
            scormBuildAction: ko.observable(),
            publishAction: ko.observable(),
            publishToAim4YouAction: ko.observable(),

            isCourseDelivering: ko.observable(false),
            courseDeliveringStarted: courseDeliveringStarted,
            courseDeliveringFinished: courseDeliveringFinished,

            navigateToCoursesEvent: navigateToCoursesEvent,

            activate: activate,
            openUpgradePlanUrl: openUpgradePlanUrl
        };

        app.on(constants.messages.course.delivering.started).then(viewModel.courseDeliveringStarted);
        app.on(constants.messages.course.delivering.finished).then(viewModel.courseDeliveringFinished);

        return viewModel;

        function courseDeliveringStarted(course) {
            if (course.id !== viewModel.courseId) {
                return;
            }

            viewModel.isCourseDelivering(true);
        };

        function courseDeliveringFinished(course) {
            if (course.id !== viewModel.courseId) {
                return;
            }

            viewModel.isCourseDelivering(false);
        };

        function openUpgradePlanUrl() {
            eventTracker.publish(constants.upgradeEvent, constants.upgradeCategory.scorm);
            router.openUrl(constants.upgradeUrl);
        }

        function navigateToCoursesEvent() {
            eventTracker.publish(events.navigateToCourses);
        }

        function activate(courseId) {
            return userContext.identify().then(function () {
                return repository.getById(courseId).then(function (course) {
                    viewModel.courseId = course.id;

                    viewModel.isCourseDelivering(course.isDelivering);

                    clientContext.set(constants.clientContextKeys.lastVistedCourse, course.id);
                    clientContext.set(constants.clientContextKeys.lastVisitedObjective, null);

                    viewModel.publishAction(publishPublishingAction(course));
                    viewModel.buildAction(buildPublishingAction(course));
                    viewModel.scormBuildAction(userContext.hasStarterAccess() ? scormBuildPublishingAction(course) : undefined);
                    viewModel.publishToAim4YouAction(publishToAim4You(course));
                }).fail(function (reason) {
                    router.activeItem.settings.lifecycleData = { redirect: '404' };
                    throw reason;
                });
            });
        }
    }
);