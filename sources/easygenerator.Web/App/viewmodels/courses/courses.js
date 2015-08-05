define(['durandal/app', 'dataContext', 'userContext', 'constants', 'eventTracker', 'plugins/router', 'repositories/courseRepository', 'notify', 'localization/localizationManager',
    'clientContext', 'fileHelper', 'authorization/limitCoursesAmount', 'commands/createCourseCommand', 'uiLocker', 'commands/presentationCourseImportCommand', 'commands/duplicateCourseCommand', 'widgets/upgradeDialog/viewmodel', 'utils/waiter'],
    function (app, dataContext, userContext, constants, eventTracker, router, courseRepository, notify, localizationManager, clientContext, fileHelper, limitCoursesAmount,
        createCourseCommand, uiLocker, presentationCourseImportCommand, duplicateCourseCommand, upgradeDialog, waiter) {
        "use strict";

        var
            events = {
                navigateToObjectives: 'Navigate to objectives',
                courseSelected: 'Course selected',
                courseUnselected: 'Course unselected',
                navigateToCourseDetails: 'Navigate to course details',
                navigateToPublishCourse: 'Navigate to publish course',
                downloadCourse: 'Download course',
                courseBuildFailed: 'Course build is failed',
                coursePublishFailed: 'Course publish is failed',
                publishCourse: 'Publish course',
                deleteCourse: 'Delete selected courses'
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
            duplicateCourse: duplicateCourse,
            navigateToDetails: navigateToDetails,
            navigateToPublish: navigateToPublish,

            newCoursePopoverVisible: ko.observable(false),
            showNewCoursePopover: showNewCoursePopover,
            hideNewCoursePopover: hideNewCoursePopover,

            deleteSelectedCourses: deleteSelectedCourses,
            createNewCourse: createNewCourse,
            importCourseFromPresentation: importCourseFromPresentation,

            courseCollaborationStarted: courseCollaborationStarted,
            deletedByCollaborator: deletedByCollaborator,
            titleUpdated: titleUpdated,
            courseUpdated: courseUpdated,
            collaborationFinished: collaborationFinished,

            openUpgradePlanUrl: openUpgradePlanUrl,

            activate: activate
        };

        viewModel.enableDeleteCourses = ko.computed(function () {
            return getSelectedCourses().length > 0;
        });

        app.on(constants.messages.course.collaboration.started, viewModel.courseCollaborationStarted);
        app.on(constants.messages.course.deletedByCollaborator, viewModel.deletedByCollaborator);
        app.on(constants.messages.course.titleUpdatedByCollaborator, viewModel.titleUpdated);
        app.on(constants.messages.course.introductionContentUpdatedByCollaborator, viewModel.courseUpdated);
        app.on(constants.messages.course.templateUpdated, viewModel.courseUpdated);
        app.on(constants.messages.course.objectivesReorderedByCollaborator, viewModel.courseUpdated);
        app.on(constants.messages.course.objectiveRelatedByCollaborator, viewModel.courseUpdated);
        app.on(constants.messages.course.objectivesUnrelatedByCollaborator, viewModel.courseUpdated);
        app.on(constants.messages.course.collaboration.finished, viewModel.collaborationFinished);

        return viewModel;

        function showNewCoursePopover() {
            viewModel.newCoursePopoverVisible(!viewModel.newCoursePopoverVisible());
        }

        function hideNewCoursePopover() {
            viewModel.newCoursePopoverVisible(false);
        }

        function openUpgradePlanUrl() {
            eventTracker.publish(constants.upgradeEvent, constants.upgradeCategory.courseLimitNotification);
            router.openUrl(constants.upgradeUrl);
        }

        function toggleSelection(course) {
            if (!course.isSelected())
                eventTracker.publish(events.courseSelected);
            else
                eventTracker.publish(events.courseUnselected);

            course.isSelected(!course.isSelected());
        }

        function duplicateCourse(course) {
            return Q.fcall(function () {
                if (!viewModel.isCreateCourseAvailable()) {
                    upgradeDialog.show(constants.dialogs.upgrade.settings.duplicateCourse);
                    return null;
                }

                var fakeCourse = createFakeCourse(course);
                viewModel.courses.unshift(fakeCourse);

                return Q.all([duplicateCourseCommand.execute(course.id, 'Courses'), waiter.waitTime(1000)]).then(function (response) {
                    fakeCourse.finishDuplicating = function () {
                        var index = viewModel.courses.indexOf(fakeCourse);
                        viewModel.courses.remove(fakeCourse);
                        viewModel.courses.splice(index, 0, mapCourse(response[0]));
                    };
                    fakeCourse.isDuplicatingFinished(true);
                });
            });
        }

        function navigateToDetails(course) {
            eventTracker.publish(events.navigateToCourseDetails);
            router.navigate('courses/' + course.id);
        }

        function navigateToPublish(course) {
            eventTracker.publish(events.navigateToPublishCourse);
            router.navigate('courses/' + course.id + '/publish');
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
            var isConnectedToLearningPath = _.some(dataContext.learningPaths, function (learningPath) {
                return _.some(learningPath.courses, function (learningPathCourse) {
                    return learningPathCourse.id === selectedCourse.id;
                });
            });

            if (selectedCourse.objectives.length > 0 || isConnectedToLearningPath) {
                notify.error(localizationManager.localize('courseCannotBeDeletedErrorMessage'));
                return;
            }

            courseRepository.removeCourse(selectedCourse.id).then(function () {
                viewModel.courses(_.without(viewModel.courses(), selectedCourse));
                notify.saved();
            });
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

        function deletedByCollaborator(courseId) {
            deleteSharedCourse(courseId);
        }

        function collaborationFinished(courseId) {
            deleteSharedCourse(courseId);
        }

        function deleteSharedCourse(courseId) {
            viewModel.sharedCourses(_.reject(viewModel.sharedCourses(), function (item) {
                return item.id == courseId;
            }));
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
            viewModel.lastVistedCourseId = clientContext.get(constants.clientContextKeys.lastVistedCourse);
            clientContext.set(constants.clientContextKeys.lastVistedCourse, null);

            viewModel.currentLanguage = localizationManager.currentLanguage;

            return userContext.identify().then(function () {
                var userEmail = userContext.identity.email;

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
            course.thumbnail = item.template.thumbnail;
            course.modifiedOn = ko.observable(item.modifiedOn);
            course.createdOn = item.createdOn;
            course.isSelected = ko.observable(false);
            course.objectives = item.objectives;
            course.isProcessed = true;

            return course;
        }

        function createFakeCourse(course) {
            return {
                id: new Date(),
                title: course.title(),
                thumbnail: course.thumbnail,
                createdOn: new Date(),
                modifiedOn: new Date(),
                isSelected: ko.observable(false),
                objectives: course.objectives,
                isProcessed: false,
                isDuplicatingFinished: ko.observable(false),
                finishDuplicating: false
            };
        }

        function createNewCourse() {
            uiLocker.lock();
            return createCourseCommand.execute('Courses')
                .then(function (course) {
                    uiLocker.unlock();
                    router.navigate('courses/' + course.id);
                })
                .fail(function () {
                    uiLocker.unlock();
                });
        }

        function importCourseFromPresentation() {
            return presentationCourseImportCommand.execute({
                startLoading: function () {
                    uiLocker.lock();
                },
                success: function (course) {
                    if (course.objectives.length) {
                        router.navigate('courses/' + course.id + '/objectives/' + course.objectives[0].id);
                    } else {
                        router.navigate('courses/' + course.id);
                    }
                },
                complete: function () {
                    uiLocker.unlock();
                }
            });
        }
    }
);