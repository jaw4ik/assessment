define(['repositories/courseRepository', 'plugins/router', 'constants', 'viewmodels/courses/publishingActions/build',
        'viewmodels/courses/publishingActions/scormBuild', 'viewmodels/courses/publishingActions/publish', 'userContext',
        'viewmodels/courses/publishingActions/publishToAim4You', 'clientContext', 'localization/localizationManager', 'eventTracker'],
    function (repository, router, constants, buildPublishingAction, scormBuildPublishingAction, publishPublishingAction, userContext, publishToAim4You,
        clientContext, localizationManager, eventTracker) {

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
            buildAction: buildPublishingAction(),
            scormBuildAction: scormBuildPublishingAction(),
            publishAction: publishPublishingAction(),
            publishToAim4YouAction: publishToAim4You(),

            navigateToCoursesEvent: navigateToCoursesEvent,

            activate: activate,
            deactivate: deactivate,

            sendOpenLinkTab: sendOpenLinkTab,
            sendOpenEmbedTab: sendOpenEmbedTab,
            sendOpenScormTab: sendOpenScormTab,
            sendOpenHtmlTab: sendOpenHtmlTab,
            sendOpenAim4YouTab: sendOpenAim4YouTab
        };

        return viewModel;

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
                }).fail(function (reason) {
                    router.activeItem.settings.lifecycleData = { redirect: '404' };
                    throw reason;
                });
            });
        }

        function deactivate() {
            viewModel.buildAction.deactivate();
            viewModel.scormBuildAction.deactivate();
            viewModel.publishAction.deactivate();
            viewModel.publishToAim4YouAction.deactivate();
        }
    }
);