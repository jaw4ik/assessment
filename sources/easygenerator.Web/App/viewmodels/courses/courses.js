define(['durandal/app', 'dataContext', 'userContext', 'constants', 'eventTracker', 'routing/router', 'repositories/courseRepository', 'notify', 'localization/localizationManager',
    'clientContext', 'fileHelper', 'authorization/limitCoursesAmount', 'uiLocker', 'commands/presentationCourseImportCommand', 'commands/duplicateCourseCommand',
    'widgets/upgradeDialog/viewmodel', 'utils/waiter', 'dialogs/course/createCourse/createCourse', 'dialogs/course/delete/deleteCourse', 'dialogs/course/stopCollaboration/stopCollaboration'],
    function (app, dataContext, userContext, constants, eventTracker, router, courseRepository, notify, localizationManager, clientContext, fileHelper, limitCoursesAmount,
        uiLocker, presentationCourseImportCommand, duplicateCourseCommand, upgradeDialog, waiter, createCourseDialog, deleteCourseDialog, stopCollaborationDialog) {
        "use strict";

        var events = {
                navigateToObjectives: 'Navigate to objectives',
                courseSelected: 'Course selected',
                courseUnselected: 'Course unselected',
                navigateToCourseDetails: 'Navigate to course details',
                navigateToPublishCourse: 'Navigate to publish course',
                downloadCourse: 'Download course',
                courseBuildFailed: 'Course build is failed',
                coursePublishFailed: 'Course publish is failed',
                publishCourse: 'Publish course',
                deleteCourse: 'Delete course',
                createNewCourse: 'Open \'Create course\' dialog',
                sortedByCreatedDate: 'Sort the list courses by a "created" date',
                sortedByModifiedDate: 'Sort the list courses by a "modified" date',
                sortedByAlphanumeric: 'Sort the list courses A-Z',
                courseListFiltered: 'Filter the list of courses',
        };

        var localStorageKey = 'coursesSortOrder';

        var localizedSelectAll = localizationManager.localize('all');

        var viewModel = {
            courses: ko.observableArray([]),
            isCreateCourseAvailable: ko.observable(true),
            lastVistedCourseId: '',

            currentCoursesLimit: limitCoursesAmount.getCurrentLimit(),

            duplicateCourse: duplicateCourse,
            navigateToDetails: navigateToDetails,
            navigateToPublish: navigateToPublish,

            newCoursePopoverVisible: ko.observable(false),
            showNewCoursePopover: showNewCoursePopover,
            hideNewCoursePopover: hideNewCoursePopover,

            deleteCourse: deleteCourse,
            courseDeleted: courseDeleted,
            createNewCourse: createNewCourse,
            createCourseCallback: createCourseCallback,
            importCourseFromPresentation: importCourseFromPresentation,
            stopCollaboration: stopCollaboration,

            courseAdded: courseAdded,
            titleUpdated: titleUpdated,
            courseUpdated: courseUpdated,
            courseOwnershipUpdated: courseOwnershipUpdated,

            openUpgradePlanUrl: openUpgradePlanUrl,
            newCourseCreated: newCourseCreated,

            coursesTitleFilter: ko.observable(''),

            coursesSortOrder: ko.observable(''),
            coursesSortOrderChanged: coursesSortOrderChanged,
            sortingOptions: {
                recentlyModified: 'recentlyModified',
                recentlyCreated: 'recentlyCreated',
                alphanumeric: 'alphanumeric'
            },

            availableTemplates: ko.observableArray([]),
            coursesTemplateFilter: ko.observable(''),
            coursesFilterChanged: coursesFilterChanged,

            activate: activate
        };       

        viewModel.ownedCourses = ko.computed(function () {
            return getCoursesSubCollection(constants.courseOwnership.owned);
        });
        viewModel.sharedCourses = ko.computed(function () {
            return getCoursesSubCollection(constants.courseOwnership.shared);
        });
        viewModel.organizationCourses = ko.computed(function () {
            return getCoursesSubCollection(constants.courseOwnership.organization);
        });

        viewModel.isCoursesListEmpty = ko.computed(function () {
            var lengthOfVisibleCourses = (viewModel.ownedCourses().length
                                        + viewModel.sharedCourses().length
                                        + viewModel.organizationCourses().length);

            return lengthOfVisibleCourses === 0;
        });

        app.on(constants.messages.course.collaboration.started, viewModel.courseAdded);
        app.on(constants.messages.course.deletedByCollaborator, viewModel.courseDeleted);
        app.on(constants.messages.course.titleUpdatedByCollaborator, viewModel.titleUpdated);
        app.on(constants.messages.course.introductionContentUpdatedByCollaborator, viewModel.courseUpdated);
        app.on(constants.messages.course.templateUpdatedByCollaborator, viewModel.courseUpdated);
        app.on(constants.messages.course.sectionsReorderedByCollaborator, viewModel.courseUpdated);
        app.on(constants.messages.course.sectionRelatedByCollaborator, viewModel.courseUpdated);
        app.on(constants.messages.course.sectionsUnrelatedByCollaborator, viewModel.courseUpdated);
        app.on(constants.messages.course.collaboration.finished, viewModel.courseDeleted);
        app.on(constants.messages.course.collaboration.finishedByCollaborator, viewModel.courseDeleted);
        app.on(constants.messages.course.ownershipUpdated, viewModel.courseOwnershipUpdated);
        app.on(constants.messages.learningPath.createCourse, viewModel.newCourseCreated);
        app.on(constants.messages.course.deleted, viewModel.courseDeleted);
        app.on(constants.messages.course.created, viewModel.newCourseCreated);
        app.on(constants.messages.organization.courseCollaborationStarted, viewModel.courseAdded);

        return viewModel;

        function activate() {
            viewModel.lastVistedCourseId = clientContext.get(constants.clientContextKeys.lastVistedCourse);
            viewModel.availableTemplates([]);
            clientContext.set(constants.clientContextKeys.lastVistedCourse, null);

            return userContext.identify().then(function () {
                viewModel.courses(_.map(dataContext.courses, mapCourse));

                viewModel.availableTemplates(_.map(dataContext.templates, mapTemplate));
                viewModel.availableTemplates(_.sortBy(viewModel.availableTemplates(), function (template) {
                    return template.name;
                }));

                var coursesLength = ko.computed(function () {
                    return viewModel.courses().length;
                });
                viewModel.availableTemplates.unshift({ name: localizedSelectAll, count: coursesLength });

                viewModel.isCreateCourseAvailable(limitCoursesAmount.checkAccess());

                viewModel.coursesTitleFilter('');
                viewModel.coursesTemplateFilter(localizedSelectAll);

                viewModel.coursesSortOrder(localStorage.getItem(localStorageKey) || viewModel.sortingOptions.recentlyModified);
            });
        }

        function getCoursesSubCollection(ownership) {
            return _.chain(viewModel.courses())
                .filter(function (item) {
                    var title = item.title().trim().toLowerCase();
                    var coursesTemplateFilter = viewModel.coursesTitleFilter().trim().toLowerCase();

                    var isVisibleByTemplate = (viewModel.coursesTemplateFilter() === localizedSelectAll)
                                             || (item.template === viewModel.coursesTemplateFilter());

                    return item.ownership() === ownership
                            && ~title.indexOf(coursesTemplateFilter)
                            && isVisibleByTemplate;
                })
                .sortBy(function (course) {
                    switch (viewModel.coursesSortOrder()) {
                        case viewModel.sortingOptions.recentlyModified:
                            return -Date.parse(course.modifiedOn());
                        case viewModel.sortingOptions.recentlyCreated:
                            return -Date.parse(course.createdOn);
                        case viewModel.sortingOptions.alphanumeric:
                            return course.title();
                    }
                })
                .value();
        }

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

        function stopCollaboration(course) {
            stopCollaborationDialog.show(course.id, course.title());
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

        function deleteCourse(course) {
            eventTracker.publish(events.deleteCourse);
            deleteCourseDialog.show(course.id, course.title());
        }       

        function mapCourse(item) {
            var course = {};

            course.id = item.id;
            course.title = ko.observable(item.title);
            course.thumbnail = item.template.thumbnail;
            course.modifiedOn = ko.observable(item.modifiedOn);
            course.createdOn = item.createdOn;
            course.createdBy = item.createdBy;
            course.createdByName = item.createdByName;
            course.isSelected = ko.observable(false);
            course.sections = item.sections;
            course.isProcessed = true;
            course.template = item.template.name;

            course.ownership = ko.observable(item.ownership);

            return course;
        }

        function mapTemplate(template) {
            return {
                name: template.name,
                count: ko.computed(function () {
                    return (_.filter(viewModel.courses(), function (course) { return course.template === template.name })).length;
                })
            };
        }

        function createFakeCourse(course) {
            return {
                id: new Date(),
                title: ko.observable(course.title()),
                thumbnail: course.thumbnail,
                createdOn: new Date(),
                modifiedOn: ko.observable(new Date()),
                createdBy: '',
                createdByName: '',
                isSelected: ko.observable(false),
                sections: course.sections,
                isProcessed: false,
                isDuplicatingFinished: ko.observable(false),
                finishDuplicating: false,
                template: course.template,

                ownership: ko.observable(constants.courseOwnership.owned)
            };
        }

        function newCourseCreated(course) {
            if (course.isDuplicate) {
                delete course.isDuplicate;
                return;
            }
            viewModel.courses.unshift(mapCourse(course));
        }

        function createCourseCallback(course) {
            router.navigate('courses/' + course.id);
        }

        function createNewCourse() {
            eventTracker.publish(events.createNewCourse);
            createCourseDialog.show(viewModel.createCourseCallback);
        }

        function importCourseFromPresentation() {
            return presentationCourseImportCommand.execute({
                startLoading: function () {
                    uiLocker.lock();
                },
                success: function (course) {
                    if (course.sections.length) {
                        router.navigate('courses/' + course.id + '/sections/' + course.sections[0].id);
                    } else {
                        router.navigate('courses/' + course.id);
                    }
                },
                complete: function () {
                    uiLocker.unlock();
                }
            });
        }

        function coursesFilterChanged() {
            eventTracker.publish(events.courseListFiltered);
        }

        function coursesSortOrderChanged() {
            switch (viewModel.coursesSortOrder()) {
                case viewModel.sortingOptions.recentlyModified:
                    eventTracker.publish(events.sortedByModifiedDate);
                    break;
                case viewModel.sortingOptions.recentlyCreated:
                    eventTracker.publish(events.sortedByCreatedDate);
                    break;
                case viewModel.sortingOptions.alphanumeric:
                    eventTracker.publish(events.sortedByAlphanumeric);
                    break;
            }

            localStorage.setItem(localStorageKey, viewModel.coursesSortOrder());
        }

        // #region event handlers

        function getCourseById(courseId) {
            return _.find(viewModel.courses(), function (item) {
                return item.id === courseId;
            });
        }

        function courseOwnershipUpdated(courseId, ownership) {
            var vmCourse = getCourseById(courseId);
            if (vmCourse) {
                vmCourse.ownership(ownership);
            }
        }

        function courseDeleted(courseId) {
            var course = _.find(viewModel.courses(), function (item) {
                return item.id === courseId;
            });

            if (course !== null) {
                viewModel.courses.remove(course);
            }
        }

        function courseAdded(course) {
            var vmCourse = getCourseById(course.id);
            if (vmCourse) {
                vmCourse.ownership(course.ownership);
            } else {
                viewModel.courses.push(mapCourse(course));
            }
        }

        function titleUpdated(course) {
            var vmCourse = getCourseById(course.id);
            if (vmCourse) {
                vmCourse.title(course.title);
                vmCourse.modifiedOn(course.modifiedOn);
            }
        }

        function courseUpdated(course) {
            var vmCourse = getCourseById(course.id);
            if (vmCourse) {
                vmCourse.modifiedOn(course.modifiedOn);
            }
        }

        // #endregion
    }
);