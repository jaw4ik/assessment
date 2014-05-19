define(['plugins/router', 'repositories/courseRepository', 'clientContext', './course.read', 'ping', 'models/backButton',
    'localization/localizationManager', 'eventTracker', './course.write', 'userContext'],
    function (router, courseRepository, clientContext, readCourseViewModel, ping, BackButtonViewModel,
        localizationManager, eventTracker, writeCourseViewModel, userContext) {
        "use strict";

        var events = {
            navigateToCourses: 'Navigate to courses'
        };

        var viewModel = {
            canActivate: canActivate,
            activate: activate,
            courseModule: null,
            backButtonData: new BackButtonViewModel({
                url: 'courses',
                backViewName: localizationManager.localize('courses'),
                callback: function() {
                     eventTracker.publish(events.navigateToCourses);
                }
            })
        };

        return viewModel;

        function canActivate() {
            return ping.execute();
        }

        function activate(courseId) {
            return courseRepository.getById(courseId).then(function (course) {
                clientContext.set('lastVistedCourse', course.id);
                clientContext.set('lastVisitedObjective', null);

                var hasEditAccess = userContext.identity.email === course.createdBy;

                viewModel.courseModule = hasEditAccess ? writeCourseViewModel : readCourseViewModel;
                viewModel.courseModule.initialize(course);
            }).fail(function (reason) {
                router.activeItem.settings.lifecycleData = { redirect: '404' };
                throw reason;
            });
        }

    }
);