define(['repositories/courseRepository', 'plugins/router', 'constants', 'userContext', 'clientContext', 'localization/localizationManager', 'eventTracker',
        'viewmodels/courses/publishingActions/build', 'viewmodels/courses/publishingActions/scormBuild', 'viewmodels/courses/publishingActions/publish', 
        'viewmodels/courses/publishingActions/publishToCustomLMS'],
    function (repository, router, constants, userContext, clientContext, localizationManager, eventTracker, 
        buildPublishingAction, scormBuildPublishingAction, publishPublishingAction, publishToCustomLmsAction) {

        var events = {
            navigateToCourses: 'Navigate to courses',
            openEmbedTab: 'Open embed tab',
            openLinkTab: 'Open link tab',
            openScormTab: 'Open \'download SCORM\'',
            openHtmlTab: 'Open \'downoload HTML\'',
            openCustomPublishTab: 'Open custom publish tab'
        };

        var viewModel = {
            courseId: '',
            publishToCustomLmsModels: [],

            buildAction: buildPublishingAction(),
            scormBuildAction: scormBuildPublishingAction(),
            publishAction: publishPublishingAction(),

            navigateToCoursesEvent: navigateToCoursesEvent,

            activate: activate,
            deactivate: deactivate,

            sendOpenCustomPublishTab: sendOpenCustomPublishTab,
            sendOpenLinkTab: sendOpenLinkTab,
            sendOpenEmbedTab: sendOpenEmbedTab,
            sendOpenScormTab: sendOpenScormTab,
            sendOpenHtmlTab: sendOpenHtmlTab
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

        function activate(courseId) {
            return userContext.identify().then(function () {
                viewModel.publishToCustomLmsModels = userContext.identity.companies.sort((company1, company2) => {
                    if (company1.priority === company2.priority) {
                        return (new Date(company1.createdOn)).getTime() > (new Date(company2.createdOn)).getTime();
                    }
                    return company1.priority < company2.priority;
                }).map(function(company) {
                    return {
                        company: company,
                        model: publishToCustomLmsAction()
                    }
                });

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
            viewModel.publishToCustomLmsModels.forEach(function(publishToCustomLmsModel) {
                publishToCustomLmsModel.model.deactivate();
            });
        }
    }
);