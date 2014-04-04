define(['durandal/app', 'dataContext', 'constants', 'eventTracker', 'plugins/router', 'repositories/courseRepository', 'notify', 'localization/localizationManager', 'clientContext', 'dom'],
    function (app, dataContext, constants, eventTracker, router, courseRepository, notify, localizationManager, clientContext, dom) {
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
            courses: ko.observableArray([]),
            toggleSelection: toggleSelection,

            navigateToCreation: navigateToCreation,
            navigateToDetails: navigateToDetails,
            navigateToObjectives: navigateToObjectives,

            states: constants.publishingStates,
            downloadCourse: downloadCourse,
            enableOpenCourse: enableOpenCourse,
            
            publishCourse: publishCourse,
            openPublishedCourse: openPublishedCourse,

            deleteSelectedCourses: deleteSelectedCourses,
            lastVistedCourseId: '',
            currentLanguage: '',

            activate: activate,
            deactivate: deactivate
        };

        viewModel.enableDeleteCourses = ko.computed(function () {
            return getSelectedCourses().length > 0;
        });

        //#region build events

        app.on(constants.messages.course.build.started).then(function (course) {
            updateCourseViewModelIfExists(course.id, function (expVm) {
                expVm.publishingState(constants.publishingStates.building);
                expVm.showStatus(true);
            });
        });

        app.on(constants.messages.course.build.completed, function (course) {
            updateCourseViewModelIfExists(course.id, function (expVm) {

                expVm.publishingState(constants.publishingStates.succeed);
                expVm.packageUrl(course.packageUrl);
            });
        });

        app.on(constants.messages.course.build.failed, function (courseId) {
            updateCourseViewModelIfExists(courseId, function (expVm) {
                expVm.publishingState(constants.publishingStates.failed);
                expVm.packageUrl('');
            });
        });

        //#endregion build events

        //#region publish events
        app.on(constants.messages.course.publish.started).then(function (course) {
            updateCourseViewModelIfExists(course.id, function (expVm) {
                expVm.publishingState(constants.publishingStates.publishing);
                expVm.showStatus(true);
            });
        });

        app.on(constants.messages.course.publish.completed, function (course) {
            updateCourseViewModelIfExists(course.id, function (expVm) {
                expVm.publishingState(constants.publishingStates.succeed);
                expVm.publishedPackageUrl(course.publishedPackageUrl);
            });
        });

        app.on(constants.messages.course.publish.failed, function (courseId) {
            updateCourseViewModelIfExists(courseId, function (expVm) {
                expVm.publishingState(constants.publishingStates.failed);
                expVm.publishedPackageUrl('');
            });
        });

       app.on(constants.messages.course.publishToAim4You.completed, function (course) {
            updateCourseViewModelIfExists(course.id, function (expVm) {
                expVm.publishingState(constants.publishingStates.succeed);
            });
        });

        app.on(constants.messages.course.publishToAim4You.failed, function (courseId) {
            updateCourseViewModelIfExists(courseId, function (expVm) {
                expVm.publishingState(constants.publishingStates.failed);
            });
        });
        //#endregion publish events

        return viewModel;

        function toggleSelection(course) {
            if (!course.isSelected())
                eventTracker.publish(events.courseSelected);
            else
                eventTracker.publish(events.courseUnselected);

            course.isSelected(!course.isSelected());
        }

        function navigateToCreation() {
            eventTracker.publish(events.navigateToCreateCourse);
            router.navigate('course/create');
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

                return courseRepository.getById(exp.id).then(function(course) {
                    return course.publish();
                }).fail(function(reason) {
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
                    return course.build().then(function() {
                        dom.clickElementById('packageLink_' + exp.id);
                    });
                }).fail(function(reason) {
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
                course.publishingState = ko.observable(item.publishingState);
                course.packageUrl = ko.observable(item.packageUrl);
                course.publishedPackageUrl = ko.observable(item.publishedPackageUrl);
                course.modifiedOn = item.modifiedOn;
                course.isSelected = ko.observable(false);
                course.showStatus = ko.observable();
                
                course.publishPackageExists = ko.computed(function () {
                    return !_.isNullOrUndefined(this.publishedPackageUrl()) && !_.isEmptyOrWhitespace(this.publishedPackageUrl());
                }, course);

                var storageItem = storage[item.id] || { showStatus: false, publishingState: constants.publishingStates.notStarted };
                var showStatus = storageItem.showStatus || (item.publishingState === constants.publishingStates.building || item.publishingState === constants.publishingStates.publishing ||
                     item.publishingState !== storageItem.publishingState);
                course.showStatus(showStatus);
                
                return course;
            }));
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
            if(course.publishPackageExists()) {
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