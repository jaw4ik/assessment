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
                downloadCourse: 'Download course',
                courseBuildFailed: 'Course build is failed',
                coursePublishFailed: 'Course publish is failed',
                publishCourse: 'Publish course',
                deleteCourse: "Delete selected courses"
            },

            storage = [];


        var viewModel = {
            states: constants.publishingStates,

            courses: ko.observableArray([]),
            isCreateCourseAvailable: ko.observable(true),
            lastVistedCourseId: '',

            currentLanguage: '',

            hasStarterAccess: true,
            coursesFreeLimit: limitCoursesAmount.getFreeLimit(),
            coursesStarterLimit: limitCoursesAmount.getStarterLimit(),

            toggleSelection: toggleSelection,

            navigateToCreation: navigateToCreation,
            navigateToDetails: navigateToDetails,
            navigateToObjectives: navigateToObjectives,

            downloadCourse: downloadCourse,
            enableOpenCourse: enableOpenCourse,

            publishCourse: publishCourse,
            openPublishedCourse: openPublishedCourse,

            deleteSelectedCourses: deleteSelectedCourses,

            canActivate: canActivate,
            activate: activate,
            deactivate: deactivate,

            courseBuildStarted: courseBuildStarted,
            courseBuildCompleted: courseBuildCompleted,
            courseBuildFailed: courseBuildFailed,
            courseScormBuildCompleted: courseScormBuildCompleted,
            courseScormBuildFailed: courseScormBuildFailed,

            coursePublishStarted: coursePublishStarted,
            coursePublishCompleted: coursePublishCompleted,
            coursePublishFailed: coursePublishFailed,
            coursePublishToAim4YouStarted: coursePublishToAim4YouStarted,
            coursePublishToAim4YouCompleted: coursePublishToAim4YouCompleted,
            coursePublishToAim4YouFailed: coursePublishToAim4YouFailed
        };

        viewModel.enableDeleteCourses = ko.computed(function () {
            return getSelectedCourses().length > 0;
        });

        app.on(constants.messages.course.build.started).then(viewModel.courseBuildStarted);
        app.on(constants.messages.course.build.completed).then(viewModel.courseBuildCompleted);
        app.on(constants.messages.course.build.failed).then(viewModel.courseBuildFailed);
        app.on(constants.messages.course.scormBuild.completed).then(viewModel.courseScormBuildCompleted);
        app.on(constants.messages.course.scormBuild.failed).then(viewModel.courseScormBuildFailed);

        app.on(constants.messages.course.publish.started).then(viewModel.coursePublishStarted);
        app.on(constants.messages.course.publish.completed).then(viewModel.coursePublishCompleted);
        app.on(constants.messages.course.publish.failed).then(viewModel.coursePublishFailed);
        app.on(constants.messages.course.publishToAim4You.started).then(viewModel.coursePublishToAim4YouStarted);
        app.on(constants.messages.course.publishToAim4You.completed).then(viewModel.coursePublishToAim4YouCompleted);
        app.on(constants.messages.course.publishToAim4You.failed).then(viewModel.coursePublishToAim4YouFailed);

        return viewModel;


        //#region build events

        function courseBuildStarted(course) {
            updateCourseViewModelIfExists(course.id, function (expVm) {
                expVm.publishingState(constants.publishingStates.building);
                expVm.showStatus(true);
            });
        };

        function courseBuildCompleted(course) {
            updateCourseViewModelIfExists(course.id, function (expVm) {
                expVm.publishingState(constants.publishingStates.succeed);
                expVm.packageUrl(course.build.packageUrl);
            });
        };

        function courseBuildFailed(course) {
            updateCourseViewModelIfExists(course.id, function (expVm) {
                expVm.publishingState(constants.publishingStates.failed);
                expVm.packageUrl('');
            });
        };

        function courseScormBuildCompleted(course) {
            updateCourseViewModelIfExists(course.id, function (expVm) {
                expVm.publishingState(constants.publishingStates.succeed);
            });
        };

        function courseScormBuildFailed(course) {
            updateCourseViewModelIfExists(course.id, function (expVm) {
                expVm.publishingState(constants.publishingStates.failed);
            });
        };

        //#endregion build events

        //#region publish events

        function coursePublishStarted(course) {
            updateCourseViewModelIfExists(course.id, function (expVm) {
                expVm.publishingState(constants.publishingStates.publishing);
                expVm.showStatus(true);
            });
        };

        function coursePublishCompleted(course) {
            updateCourseViewModelIfExists(course.id, function (expVm) {
                expVm.publishingState(constants.publishingStates.succeed);
                expVm.publishedPackageUrl(course.publish.packageUrl);
            });
        };

        function coursePublishFailed(course) {
            updateCourseViewModelIfExists(course.id, function (expVm) {
                expVm.publishingState(constants.publishingStates.failed);
                expVm.publishedPackageUrl('');
            });
        };

        function coursePublishToAim4YouStarted(course) {
            updateCourseViewModelIfExists(course.id, function (expVm) {
                expVm.publishingState(constants.publishingStates.publishing);
            });
        };

        function coursePublishToAim4YouCompleted(course) {
            updateCourseViewModelIfExists(course.id, function (expVm) {
                expVm.publishingState(constants.publishingStates.succeed);
            });
        };

        function coursePublishToAim4YouFailed(course) {
            updateCourseViewModelIfExists(course.id, function (expVm) {
                expVm.publishingState(constants.publishingStates.failed);
            });
        };

        //#endregion publish events

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

        function navigateToObjectives() {
            eventTracker.publish(events.navigateToObjectives);
            router.navigate('objectives');
        }

        function publishCourse(exp) {
            if (exp.publishingState() !== constants.publishingStates.building && exp.publishingState() !== constants.publishingStates.publishing) {
                exp.publishingState(constants.publishingStates.building);
                notify.hide();
                eventTracker.publish(events.publishCourse);
                if (exp.isSelected()) {
                    exp.isSelected(false);
                }

                return courseRepository.getById(exp.id).then(function (course) {
                    return course.publish();
                }).fail(function (reason) {
                    notifyError(reason);
                    eventTracker.publish(events.coursePublishFailed);
                });
            }
        }

        function downloadCourse(exp) {
            if (exp.publishingState() !== constants.publishingStates.building && exp.publishingState() !== constants.publishingStates.publishing) {
                exp.publishingState(constants.publishingStates.building);
                notify.hide();
                eventTracker.publish(events.downloadCourse);
                if (exp.isSelected()) {
                    exp.isSelected(false);
                }

                return courseRepository.getById(exp.id).then(function(course) {
                    return course.build().then(function(courseInfo) {
                        fileHelper.downloadFile('download/' + courseInfo.build.packageUrl);
                    });
                }).fail(function (reason) {
                    eventTracker.publish(events.courseBuildFailed);
                    notifyError(reason);
                });
            }
        }

        function enableOpenCourse(course) {
            if (course.publishingState() !== constants.publishingStates.building && course.publishingState() !== constants.publishingStates.publishing) {
                course.showStatus(false);
            }
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
                notifyError(localizationManager.localize('deleteSeveralCoursesError'));
                return;
            }

            var selectedCourse = selectedCourses[0];
            if (selectedCourse.objectives.length > 0) {
                notifyError(localizationManager.localize('courseCannotBeDeleted'));
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

        function activate() {

            var sortedCourses = _.sortBy(dataContext.courses, function (course) {
                return -course.createdOn;
            });

            viewModel.lastVistedCourseId = clientContext.get('lastVistedCourse');
            viewModel.currentLanguage = localizationManager.currentLanguage;

            clientContext.set('lastVistedCourse', null);

            viewModel.courses(_.map(sortedCourses, function (item) {
                var course = {};

                course.id = item.id;
                course.title = item.title;
                course.image = item.template.image;
                course.objectives = item.objectives;
                course.publishingState = ko.observable(item.getState());
                course.packageUrl = ko.observable(item.build.packageUrl);
                course.publishedPackageUrl = ko.observable(item.publish.packageUrl);
                course.modifiedOn = item.modifiedOn;
                course.isSelected = ko.observable(false);
                course.showStatus = ko.observable();

                course.publishPackageExists = ko.computed(function () {
                    return !_.isNullOrUndefined(this.publishedPackageUrl()) && !_.isEmptyOrWhitespace(this.publishedPackageUrl());
                }, course);

                var storageItem = storage[item.id] || { showStatus: false, publishingState: constants.publishingStates.notStarted };
                var showStatus = storageItem.showStatus || (item.getState() === constants.publishingStates.building || item.getState() === constants.publishingStates.publishing ||
                     item.getState() !== storageItem.publishingState);
                course.showStatus(showStatus);

                return course;
            }));

            return userContext.identify().then(function () {
                viewModel.courses.subscribe(function () {
                    viewModel.isCreateCourseAvailable(limitCoursesAmount.checkAccess());
                });
                viewModel.isCreateCourseAvailable(limitCoursesAmount.checkAccess());
                viewModel.hasStarterAccess = userContext.hasStarterAccess();
            });
        }

        function deactivate() {
            storage = [];
            _.each(viewModel.courses(), function (item) {
                storage[item.id] = {
                    showStatus: item.showStatus(),
                    publishingState: item.publishingState()
                };
            });
        };

        function notifyError(message) {
            if (!_.isNullOrUndefined(message)) {
                notify.error(message);
            }
        }

        function openPublishedCourse(course) {
            if (course.publishPackageExists()) {
                router.openUrl(course.publishedPackageUrl());
            }
        }

        function updateCourseViewModelIfExists(courseId, handler) {
            var expVm = _.find(viewModel.courses(), function (item) {
                return item.id == courseId;
            });

            if (_.isObject(expVm)) {
                handler(expVm);
            }
        }
    }
);