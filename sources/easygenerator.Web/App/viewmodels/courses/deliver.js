define(['durandal/app', 'repositories/courseRepository', 'plugins/router', 'constants', 'viewmodels/courses/deliveringActions/build',
        'viewmodels/courses/deliveringActions/scormBuild', 'viewmodels/courses/deliveringActions/publish', 'userContext',
        'viewmodels/courses/deliveringActions/publishToAim4You', 'clientContext', 'localization/localizationManager', 'eventTracker', 'notify'],
    function (app, repository, router, constants, buildDeliveringAction, scormBuildDeliveringAction, publishDeliveringAction, userContext, publishToAim4You,
        clientContext, localizationManager, eventTracker, notify) {

        var goBackTooltip = '',
            events = {
                navigateToCourses: 'Navigate to courses',
            };

        var viewModel = {
            courseId: '',
            states: constants.deliveringStates,

            buildAction: ko.observable(),
            scormBuildAction: ko.observable(),
            publishAction: ko.observable(),
            publishToAim4YouAction: ko.observable(),

            goBackTooltip: goBackTooltip,
            navigateToCourses: navigateToCourses,

            activate: activate,
        };

        viewModel.isDeliveringInProgress = ko.computed(function () {
            return _.some([this.buildAction(), this.scormBuildAction(), this.publishAction(), this.publishToAim4YouAction()], function (action) {
                return _.isObject(action) && action.isDelivering();
            });
        }, viewModel);

        app.on(constants.messages.course.build.failed, notifyError);
        app.on(constants.messages.course.publish.failed, notifyError);

        return viewModel;

        function navigateToCourses() {
            eventTracker.publish(events.navigateToCourses);
            router.navigate('courses');
        }

        function notifyError(courseId, message) {
            if (courseId == viewModel.courseId && !_.isNullOrUndefined(message)) {
                notify.error(message);
            }
        }

        function activate(courseId) {
            viewModel.goBackTooltip = localizationManager.localize('backTo') + ' ' + localizationManager.localize('courses');

            return userContext.identify().then(function () {
                return repository.getById(courseId).then(function (course) {
                    viewModel.courseId = course.id;
                    
                    clientContext.set('lastVistedCourse', course.id);
                    clientContext.set('lastVisitedObjective', null);

                    viewModel.publishAction(publishDeliveringAction(course.id, course.publishedPackageUrl));
                    viewModel.buildAction(buildDeliveringAction(course.id, course.packageUrl));
                    viewModel.scormBuildAction(userContext.hasStarterAccess() ? scormBuildDeliveringAction(course.id, course.scormPackageUrl) : undefined);
                    viewModel.publishToAim4YouAction(publishToAim4You(course.id));
                }).fail(function (reason) {
                    router.activeItem.settings.lifecycleData = { redirect: '404' };
                    throw reason;
                });
            });
        }
    }
);