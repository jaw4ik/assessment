define(['repositories/courseRepository', 'plugins/router', 'constants', 'viewmodels/courses/publishingActions/build',
        'viewmodels/courses/publishingActions/scormBuild', 'viewmodels/courses/publishingActions/publish', 'userContext',
        'viewmodels/courses/publishingActions/publishToAim4You', 'clientContext', 'localization/localizationManager', 'eventTracker', 'models/backButton', 'durandal/app'],
    function (repository, router, constants, buildPublishingAction, scormBuildPublishingAction, publishPublishingAction, userContext, publishToAim4You,
        clientContext, localizationManager, eventTracker, BackButton, app) {

        var events = {
            navigateToCourses: 'Navigate to courses',
            openEmbedTab: 'Open embed tab',
            openLinkTab: 'Open link tab',
            openScormTab: 'Open \'download SCORM\'',
            openHtmlTab: 'Open \'downoload HTML\'',
            openAim4YouTab: 'Open \'Publish to Aim4You\'',
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
            openUpgradePlanUrl: openUpgradePlanUrl,

            sendOpenLinkTab: sendOpenLinkTab,
            sendOpenEmbedTab: sendOpenEmbedTab,
            sendOpenScormTab: sendOpenScormTab,
            sendOpenHtmlTab: sendOpenHtmlTab,
            sendOpenAim4YouTab: sendOpenAim4YouTab,

            backButtonData: new BackButton({
                url: 'courses',
                backViewName: localizationManager.localize('courses'),
                callback: navigateToCoursesEvent
            })
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

        function sendOpenLinkTab() {
            eventTracker.publish(events.openLinkTab);
        }

        function sendOpenEmbedTab() {
            eventTracker.publish(events.openEmbedTab);
        }

        function sendOpenScormTab() {
            eventTracker.publish(events.openScormTab);
        }

        function sendOpenHtmlTab() {
            eventTracker.publish(events.openHtmlTab);
        }

        function sendOpenAim4YouTab() {
            eventTracker.publish(events.openAim4YouTab);
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