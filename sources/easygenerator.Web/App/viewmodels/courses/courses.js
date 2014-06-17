define(['durandal/app', 'dataContext', 'userContext', 'constants', 'eventTracker', 'plugins/router', 'repositories/courseRepository', 'notify', 'localization/localizationManager', 'clientContext', 'fileHelper', 'authorization/limitCoursesAmount', 'ping'],
    function (app, dataContext, userContext, constants, eventTracker, router, courseRepository, notify, localizationManager, clientContext, fileHelper, limitCoursesAmount, ping) {
        "use strict";

        var
            events = {
                navigateToObjectives: 'Navigate to objectives',
                navigateToCreateCourse: 'Navigate to create course',
                courseSelected: 'Course selected',
                courseUnselected: 'Course unselected',
                navigateToCourseDetails: 'Navigate to course details',
                navigateToPublishCourse: 'Navigate to publish course',
                downloadCourse: 'Download course',
                courseBuildFailed: 'Course build is failed',
                coursePublishFailed: 'Course publish is failed',
                publishCourse: 'Publish course',
                deleteCourse: "Delete selected courses"
            };


        var viewModel = {
            courses: ko.observableArray([]),
            sharedCourses: ko.observableArray([]),
            isCreateCourseAvailable: ko.observable(true),
            lastVistedCourseId: '',

            currentLanguage: '',

            hasStarterAccess: true,
            coursesFreeLimit: limitCoursesAmount.getFreeLimit(),
            coursesStarterLimit: limitCoursesAmount.getStarterLimit(),

            toggleSelection: toggleSelection,

            navigateToCreation: navigateToCreation,
            navigateToDetails: navigateToDetails,
            navigateToPublish: navigateToPublish,

            deleteSelectedCourses: deleteSelectedCourses,

            courseCollaborationStarted: courseCollaborationStarted,
            titleUpdated: titleUpdated,
            courseUpdated: courseUpdated,

            canActivate: canActivate,
            activate: activate
        };

        viewModel.enableDeleteCourses = ko.computed(function () {
            return getSelectedCourses().length > 0;
        });

        app.on(constants.messages.course.collaboration.started, courseCollaborationStarted);
        app.on(constants.messages.course.titleUpdatedByCollaborator, titleUpdated);
        app.on(constants.messages.course.introductionContentUpdatedByCollaborator, courseUpdated);
        app.on(constants.messages.course.templateUpdated, courseUpdated);
        app.on(constants.messages.course.objectivesReorderedByCollaborator, courseUpdated);
        app.on(constants.messages.course.objectiveRelatedByCollaborator, courseUpdated);
        app.on(constants.messages.course.objectivesUnrelatedByCollaborator, courseUpdated);

        return viewModel;

        function toggleSelection(course) {
            if (!course.isSelected())
                eventTracker.publish(events.courseSelected);
            else
                eventTracker.publish(events.courseUnselected);

            course.isSelected(!course.isSelected());
        }

        function navigateToCreation() {
            if (viewModel.isCreateCourseAvailable()) {
                eventTracker.publish(events.navigateToCreateCourse);
                router.navigate('course/create');
            }
        }

        function navigateToDetails(course) {
            eventTracker.publish(events.navigateToCourseDetails);
            router.navigate('course/' + course.id);
        }

        function navigateToPublish(course) {
            eventTracker.publish(events.navigateToPublishCourse);
            router.navigate('publish/' + course.id);
        }

        function getSelectedCourses() {
            return _.filter(viewModel.courses(), function (course) {
                return course.isSelected && course.isSelected();
            });
        }

        function deleteSelectedCourses() {
            eventTracker.publish(events.deleteCourse);

            var selectedCourses = getSelectedCourses();
            if (selectedCourses.length == 0) {
                throw 'There are no courses selected';
            }
            if (selectedCourses.length > 1) {
                notify.error(localizationManager.localize('deleteSeveralCoursesError'));
                return;
            }

            var selectedCourse = selectedCourses[0];
            if (selectedCourse.objectives.length > 0) {
                notify.error(localizationManager.localize('courseCannotBeDeleted'));
                return;
            }

            courseRepository.removeCourse(selectedCourse.id).then(function () {
                viewModel.courses(_.without(viewModel.courses(), selectedCourse));
                notify.saved();
            });
        }

        function canActivate() {
            return ping.execute();
        }

        function courseCollaborationStarted(course) {
            var sharedCourses = viewModel.sharedCourses();
            sharedCourses.push(mapCourse(course));
            sharedCourses = _.sortBy(sharedCourses, function (item) {
                return -item.createdOn;
            });

            viewModel.sharedCourses(sharedCourses);
        }

        function titleUpdated(course) {
            var vmCourse = getCourseViewModel(course.id);

            if (_.isObject(vmCourse)) {
                vmCourse.title(course.title);
                vmCourse.modifiedOn(course.modifiedOn);
            }
        }

        function courseUpdated(course) {
            var vmCourse = getCourseViewModel(course.id);

            if (_.isObject(vmCourse)) {
                vmCourse.modifiedOn(course.modifiedOn);
            }
        }

        function getCourseViewModel(courseId) {
            var courses = viewModel.sharedCourses().concat(viewModel.courses());

            return _.find(courses, function (item) {
                return item.id == courseId;
            });
        }

        function activate() {
            viewModel.lastVistedCourseId = clientContext.get('lastVistedCourse');
            viewModel.currentLanguage = localizationManager.currentLanguage;

            return userContext.identify().then(function () {
                var userEmail = userContext.identity.email;

                clientContext.set('lastVistedCourse', null);

                viewModel.courses(mapCourses(_.filter(dataContext.courses, function (item) {
                    return item.createdBy == userEmail;
                })));

                viewModel.sharedCourses(mapCourses(_.filter(dataContext.courses, function (item) {
                    return item.createdBy != userEmail;
                })));

                viewModel.courses.subscribe(function () {
                    viewModel.isCreateCourseAvailable(limitCoursesAmount.checkAccess());
                });
                viewModel.isCreateCourseAvailable(limitCoursesAmount.checkAccess());
                viewModel.hasStarterAccess = userContext.hasStarterAccess();
            });
        }

        function mapCourses(courses) {
            return _.chain(courses)
                 .sortBy(function (item) {
                     return -item.createdOn;
                 })
                 .map(function (item) {
                     return mapCourse(item);
                 })
                 .value();
        }

        function mapCourse(item) {
            var course = {};

            course.id = item.id;
            course.title = ko.observable(item.title);
            course.image = item.template.image;
            course.modifiedOn = ko.observable(item.modifiedOn);
            course.createdOn = item.createdOn;
            course.isSelected = ko.observable(false);
            course.objectives = item.objectives;

            return course;
        }

    }
);