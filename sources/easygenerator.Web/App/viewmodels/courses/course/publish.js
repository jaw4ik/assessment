define(['repositories/courseRepository', 'plugins/router', 'constants', 'userContext', 'clientContext', 'localization/localizationManager', 'eventTracker',
        'viewmodels/courses/publishingActions/build', 'viewmodels/courses/publishingActions/scormBuild', 'viewmodels/courses/publishingActions/publish', 
        'viewmodels/courses/publishingActions/publishToAim4You', 'viewmodels/courses/publishingActions/publishToCustomLMS'],
    function (repository, router, constants, userContext, clientContext, localizationManager, eventTracker, 
        buildPublishingAction, scormBuildPublishingAction, publishPublishingAction, publishToAim4You, publishToCustomLmsAction) {

        var events = {
            navigateToCourses: 'Navigate to courses',
            openEmbedTab: 'Open embed tab',
            openLinkTab: 'Open link tab',
            openScormTab: 'Open \'download SCORM\'',
            openHtmlTab: 'Open \'downoload HTML\'',
            openAim4YouTab: 'Open \'Publish to Aim4You\'',
            openCustomPublishTab: 'Open custom publish tab'
        };

        var viewModel = {
            courseId: '',
            companyInfo: null,

            buildAction: buildPublishingAction(),
            scormBuildAction: scormBuildPublishingAction(),
            publishAction: publishPublishingAction(),
            publishToAim4YouAction: publishToAim4You(),
            publishToCustomLms: publishToCustomLmsAction(),

            navigateToCoursesEvent: navigateToCoursesEvent,

            activate: activate,
            deactivate: deactivate,

            sendOpenCustomPublishTab: sendOpenCustomPublishTab,
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

        function sendOpenCustomPublishTab() {
            eventTracker.publish(events.openCustomPublishTab);
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
                viewModel.companyInfo = userContext.identity.company;

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