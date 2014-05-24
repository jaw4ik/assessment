define(['plugins/router', 'eventTracker', 'localization/localizationManager', 'repositories/courseRepository', 'ping', 'models/backButton',
    'userContext', './createObjective.read', './createObjective.write', './createObjectiveInCourse.write'],
    function (router, eventTracker, localizationManager, courseRepository, ping, BackButton,
        userContext, readCreateObjectiveViewModel, writeCreateObjectiveViewModel, writeCreateObjectiveInCourseViewModel) {
        "use strict";

        var
            events = {
                navigateToObjectives: 'Navigate to objectives',
                navigateToCourse: 'Navigate to course details'
            };

        var viewModel = {
            createObjectiveModule: null,

            canActivate: canActivate,
            activate: activate,

            backButtonData: new BackButton({})
        };

        return viewModel;

        function canActivate() {
            return ping.execute();
        }

        function activate(queryParams) {
            if (!_.isNullOrUndefined(queryParams) && _.isString(queryParams.courseId)) {
                return courseRepository.getById(queryParams.courseId).then(function (course) {
                    if (_.isNull(course)) {
                        router.replace('404');
                        return;
                    }

                    viewModel.backButtonData.configure({
                        url: 'course/' + course.id,
                        backViewName: '\'' + course.title + '\'',
                        callback: function () { eventTracker.publish(events.navigateToCourse); },
                        alwaysVisible: false
                    });

                    var hasEditAccess = userContext.identity.email === course.createdBy;
                    viewModel.createObjectiveModule = hasEditAccess ? writeCreateObjectiveInCourseViewModel : readCreateObjectiveViewModel;
                    viewModel.createObjectiveModule.initialize(course);
                });
            } else {
                return Q.fcall(function () {

                    viewModel.backButtonData.configure({
                        url: 'objectives',
                        backViewName: localizationManager.localize('learningObjectives'),
                        callback: function () { eventTracker.publish(events.navigateToObjectives); },
                        alwaysVisible: true
                    });

                    viewModel.createObjectiveModule = writeCreateObjectiveViewModel;
                    viewModel.createObjectiveModule.initialize();
                });
            }
        }

    }
);