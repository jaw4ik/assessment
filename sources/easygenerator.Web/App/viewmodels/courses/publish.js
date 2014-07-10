define(['repositories/courseRepository', 'plugins/router', 'constants', 'viewmodels/courses/publishingActions/build',
        'viewmodels/courses/publishingActions/scormBuild', 'viewmodels/courses/publishingActions/publish', 'userContext',
        'viewmodels/courses/publishingActions/publishToAim4You', 'clientContext', 'localization/localizationManager', 'eventTracker', 'ping', 'models/backButton'],
    function (repository, router, constants, buildPublishingAction, scormBuildPublishingAction, publishPublishingAction, userContext, publishToAim4You,
        clientContext, localizationManager, eventTracker, ping, BackButton) {

        var events = {
            navigateToCourses: 'Navigate to courses'
        };

        var viewModel = {
            courseId: '',
            states: constants.publishingStates,

            buildAction: ko.observable(),
            buildActionClick: buildActionClick,
            scormBuildAction: ko.observable(),
            scormBuildActionClick: scormBuildActionClick,
            publishAction: ko.observable(),
            publishActionClick: publishActionClick,
            publishToAim4YouAction: ko.observable(),
            publishToAim4YouActionClick: publishToAim4YouActionClick,

            navigateToCoursesEvent: navigateToCoursesEvent,

            canActivate: canActivate,
            activate: activate,
            openUpgradePlanUrl: openUpgradePlanUrl,

            backButtonData: new BackButton({
                url: 'courses',
                backViewName: localizationManager.localize('courses'),
                callback: navigateToCoursesEvent
            })
        };

        viewModel.isPublishingInProgress = ko.computed(function () {
            return _.some([this.buildAction(), this.scormBuildAction(), this.publishAction(), this.publishToAim4YouAction()], function (action) {
                return _.isObject(action) && action.isPublishing();
            });
        }, viewModel);

        return viewModel;

        function openUpgradePlanUrl() {
            eventTracker.publish(constants.upgradeEvent, constants.upgradeCategory.scorm);
            router.openUrl(constants.upgradeUrl);
        }

        function buildActionClick() {
            if (!viewModel.isPublishingInProgress()) {
                viewModel.buildAction().downloadCourse();
            }
        }

        function scormBuildActionClick() {
            if (!viewModel.isPublishingInProgress()) {
                viewModel.scormBuildAction().downloadCourse();
            }
        }

        function publishActionClick() {
            if (!viewModel.isPublishingInProgress()) {
                viewModel.publishAction().publishCourse();
            }
        }

        function publishToAim4YouActionClick() {
            if (!viewModel.isPublishingInProgress()) {
                viewModel.publishToAim4YouAction().publishToAim4You();
            }
        }

        function navigateToCoursesEvent() {
            eventTracker.publish(events.navigateToCourses);
        }

        function canActivate() {
            return ping.execute();
        }

        function activate(courseId) {

            return userContext.identify().then(function () {
                return repository.getById(courseId).then(function (course) {
                    viewModel.courseId = course.id;

                    clientContext.set('lastVistedCourse', course.id);
                    clientContext.set('lastVisitedObjective', null);

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