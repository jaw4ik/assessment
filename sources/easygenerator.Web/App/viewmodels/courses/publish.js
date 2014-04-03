﻿define(['durandal/app', 'repositories/courseRepository', 'plugins/router', 'constants', 'viewmodels/courses/deliveringActions/build',
        'viewmodels/courses/deliveringActions/scormBuild', 'viewmodels/courses/deliveringActions/publish', 'userContext',
        'viewmodels/courses/deliveringActions/publishToAim4You', 'clientContext', 'localization/localizationManager', 'eventTracker', 'notify', 'controls/backButton/backButton'],
    function (app, repository, router, constants, buildDeliveringAction, scormBuildDeliveringAction, publishDeliveringAction, userContext, publishToAim4You,
        clientContext, localizationManager, eventTracker, notify, backButton) {

        var events = {
                navigateToCourses: 'Navigate to courses'
            };

        var viewModel = {
            courseId: '',
            states: constants.deliveringStates,

            buildAction: ko.observable(),
            scormBuildAction: ko.observable(),
            publishAction: ko.observable(),
            publishToAim4YouAction: ko.observable(),

            navigateToCoursesEvent: navigateToCoursesEvent,

            activate: activate
        };

        viewModel.isDeliveringInProgress = ko.computed(function () {
            return _.some([this.buildAction(), this.scormBuildAction(), this.publishAction(), this.publishToAim4YouAction()], function (action) {
                return _.isObject(action) && action.isDelivering();
            });
        }, viewModel);

        app.on(constants.messages.course.build.failed, notifyError);
        app.on(constants.messages.course.publish.failed, notifyError);
        app.on(constants.messages.course.scormBuild.failed, notifyError);        
        app.on(constants.messages.course.publishToAim4You.failed, notifyError);
        
        return viewModel;

        function navigateToCoursesEvent() {
            eventTracker.publish(events.navigateToCourses);
        }

        function notifyError(courseId, message) {
            if (courseId == viewModel.courseId && !_.isNullOrUndefined(message)) {
                notify.error(message);
            }
        }

        function activate(courseId) {
            var goBackTooltip = localizationManager.localize('backTo') + ' ' + localizationManager.localize('courses');
            backButton.enable(goBackTooltip, 'courses', navigateToCoursesEvent);

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