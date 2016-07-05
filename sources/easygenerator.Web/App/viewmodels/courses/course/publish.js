define(['repositories/courseRepository', 'routing/router', 'constants', 'userContext', 'clientContext', 'localization/localizationManager', 'eventTracker',
        'viewmodels/courses/publishingActions/build', 'viewmodels/courses/publishingActions/scormBuild', 'viewmodels/courses/publishingActions/publish', 
        'viewmodels/courses/publishingActions/publishToCoggno', 'viewmodels/courses/publishingActions/publishToCustomLms'],
    function (repository, router, constants, userContext, clientContext, localizationManager, eventTracker, 
        BuildPublishingAction, ScormBuildPublishingAction, PublishPublishingAction, PublishToCoggnoAction, PublishToCustomLmsAction) {

        var events = {
            navigateToCourses: 'Navigate to courses',
            openEmbedTab: 'Open embed tab',
            openLinkTab: 'Open link tab',
            openSellCourseTab: 'Open \'Sell course\' tab',
            openScormTab: 'Open \'download SCORM\'',
            openHtmlTab: 'Open \'downoload HTML\'',
            openCustomPublishTab: 'Open custom publish tab'
        };

        var viewModel = {
            courseId: '',
            publishToCustomLmsModels: [],

            buildAction: new BuildPublishingAction(),
            scormBuildAction: new ScormBuildPublishingAction(),
            publishAction: new PublishPublishingAction(),
            publishToCoggnoAction: new PublishToCoggnoAction(),
            navigateToCoursesEvent: navigateToCoursesEvent,

            activate: activate,
            deactivate: deactivate,

            sendOpenCustomPublishTab: sendOpenCustomPublishTab,
            sendOpenLinkTab: sendOpenLinkTab,
            sendOpenEmbedTab: sendOpenEmbedTab,
            sendOpenSellCourseTab: sendOpenSellCourseTab,
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

        function sendOpenSellCourseTab() {
            eventTracker.publish(events.openSellCourseTab);
        }

        function sendOpenScormTab() {
            eventTracker.publish(events.openScormTab);
        }

        function sendOpenHtmlTab() {
            eventTracker.publish(events.openHtmlTab);
        }

        function activate(courseId) {
            return userContext.identify().then(function () {
                viewModel.publishToCustomLmsModels = userContext.identity.companies.sort(function(company1, company2) {
                    if (company1.priority === company2.priority) {
                        return (new Date(company1.createdOn)).getTime() > (new Date(company2.createdOn)).getTime();
                    }
                    return company1.priority < company2.priority;
                }).map(function(company) {
                    return {
                        company: company,
                        model: new PublishToCustomLmsAction()
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
            viewModel.publishToCoggnoAction.deactivate();
            viewModel.publishToCustomLmsModels.forEach(function(publishToCustomLmsModel) {
                publishToCustomLmsModel.model.deactivate();
            });
        }
    }
);