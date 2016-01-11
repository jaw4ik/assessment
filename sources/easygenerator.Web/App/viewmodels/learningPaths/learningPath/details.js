define(['viewmodels/learningPaths/learningPath/queries/getLearningPathByIdQuery', 'plugins/router', 'constants', 'localization/localizationManager',
 'eventTracker', 'viewmodels/learningPaths/courseSelector/courseSelector',
 'durandal/app', 'viewmodels/learningPaths/learningPath/courseBrief', 'viewmodels/learningPaths/learningPath/commands/addCourseCommand',
'viewmodels/learningPaths/learningPath/commands/removeCourseCommand', 'repositories/courseRepository', 'notify', 'viewmodels/learningPaths/learningPath/commands/updateCoursesOrderCommand', 'dialogs/course/createCourse/createCourse',
'dialogs/document/create', 'commands/createDocumentCommand',
'knockout'],
    function (getLearningPathByIdQuery, router, constants, localizationManager, eventTracker, courseSelector, app, CourseBrief,
         addCourseCommand, removeCourseCommand, courseRepository, notify, updateCoursesOrderCommand, createCourseDialog, createDocumentDialog, createDocumentCommand, ko) {
        "use strict";

        var
            events = {
                navigateToLearningPaths: 'Navigate to learning paths',
                addCourse: 'Add course to the learning path',
                removeCourse: 'Remove course from the learning path',
                showAvailableCourses: 'Show courses available for the learning path (Add courses)',
                createNewCourse: 'Open \'Create course\' dialog',
                hideAvailableCourses: 'Hide courses available for the learning path (Done)',
                changeCoursesOrder: 'Change order of courses',
                navigateToCourseDetails: 'Navigate to course details',
                addPowerPointDocument: 'Open \'Add PowerPoint document\' popup',
                addPdfDocument: 'Open \'Add PDF document\' popup',
                addOfficeDocument: 'Open \'Add Office documents\' popup',
                powerPointDocumentAdded: 'PowerPoint document added',
                pdfDocumentAdded: 'PDF document added',
                OfficeDocumentAdded: 'Office document added',
                cancelAddPowerPointDocument: 'Close \'Add PowerPoint document\' popup',
                cancelAddPdfDocument: 'Close \'Add PDF document\' popup',
                cancelAddOfficeDocument: 'Close \'Add Office document\' popup'
            },
            viewModel = {
                id: null,
                activate: activate,
                deactivate: deactivate,
                back: back,
                createNewCourse: createNewCourse,
                createCourseCallback: createCourseCallback,
                addCourses: addCourses,
                finishAddingCourses: finishAddingCourses,
                addPowerPointDocument: addPowerPointDocument,
                addPdfDocument: addPdfDocument,
                addOfficeDocument: addOfficeDocument,
                courseSelector: courseSelector,
                addCourse: addCourse,
                removeCourse: removeCourse,
                courseDeleted: courseDeleted,
                entities: ko.observableArray([]),
                addCoursesPopoverVisibility: ko.observable(false),
                currentLanguage: '',
                updateCoursesOrder: updateCoursesOrder,
                courseTitleUpdated: courseTitleUpdated,
                navigateToDetails: navigateToDetails,
                toggleAddCoursesPopoverVisibility: toggleAddCoursesPopoverVisibility,
                hideAddCoursesPopover: hideAddCoursesPopover
            };

        viewModel.isSortingEnabled = ko.computed(function () {
            return viewModel.entities().length > 1;
        });

        return viewModel;

        function back() {
            eventTracker.publish(events.navigateToLearningPaths);
            router.navigate('#learningpaths');
        }

        function activate(learningPathId) {
            viewModel.id = learningPathId;
            viewModel.currentLanguage = localizationManager.currentLanguage;

            app.on(constants.messages.learningPath.courseSelector.courseSelected, viewModel.addCourse);
            app.on(constants.messages.learningPath.courseSelector.courseDeselected, viewModel.removeCourse);
            app.on(constants.messages.learningPath.removeCourse, viewModel.removeCourse);
            app.on(constants.messages.course.deleted, viewModel.courseDeleted);
            app.on(constants.messages.course.titleUpdatedByCollaborator, viewModel.courseTitleUpdated);

            return getLearningPathByIdQuery.execute(viewModel.id).then(function (learningPath) {
                viewModel.courseSelector.isExpanded(learningPath.entities.length === 0);

                var collection = _.chain(learningPath.entities)
                     .map(function (item) {
                         return new CourseBrief(item);
                     }).value();

                viewModel.entities(collection);
            });
        }

        function deactivate() {
            app.off(constants.messages.learningPath.courseSelector.courseSelected, viewModel.addCourse);
            app.off(constants.messages.learningPath.courseSelector.courseDeselected, viewModel.removeCourse);
            app.off(constants.messages.learningPath.removeCourse, viewModel.removeCourse);
            app.off(constants.messages.course.deleted, viewModel.courseDeleted);
            app.off(constants.messages.course.titleUpdatedByCollaborator, viewModel.courseTitleUpdated);
        }

        function addCourses() {
            eventTracker.publish(events.showAvailableCourses);
            courseSelector.expand();
        }

        function finishAddingCourses() {
            eventTracker.publish(events.hideAvailableCourses);
            courseSelector.collapse();
        }

        function addDocument(type, openDialogEvent, finishEvent, cancelEvent) {
            eventTracker.publish(openDialogEvent);
            createDocumentDialog.show(cancelEvent, function(title, embedCode) {
                if (title && embedCode) {
                    createDocumentCommand.execute(type, title, embedCode).then(function (document) {
                        eventTracker.publish(finishEvent);
                        viewModel.entities.push(document);
                    });
                }
            });
        }

        function addPowerPointDocument() {
            addDocument(constants.documentType.powerPoint, events.addPowerPointDocument, events.powerPointDocumentAdded, events.cancelAddPowerPointDocument);
        }

        function addPdfDocument() {
            addDocument(constants.documentType.pdf, events.addPdfDocument, events.pdfDocumentAdded, events.cancelAddPdfDocument);
        }

        function addOfficeDocument() {
            addDocument(constants.documentType.office, events.addOfficeDocument, events.OfficeDocumentAdded, events.cancelAddOfficeDocument);
        }

        function addCourse(courseId) {
            eventTracker.publish(events.addCourse);
            courseRepository.getById(courseId).then(function (course) {
                viewModel.entities.push(new CourseBrief(course));
            });

            addCourseCommand.execute(viewModel.id, courseId).then(function () {
                notify.saved();
            });
        }

        function removeCourse(courseId) {
            eventTracker.publish(events.removeCourse);
            
            return removeCourseCommand.execute(viewModel.id, courseId).then(function () {
                viewModel.courseDeleted(courseId);
                notify.saved();
            });
        }

        function courseDeleted(courseId) {
            viewModel.entities(_.reject(viewModel.entities(), function (item) {
                return item.id === courseId;
            }));

            if (!viewModel.courseSelector.isExpanded() && viewModel.entities().length === 0) {
                viewModel.courseSelector.expand();
            }
        }

        function createCourseCallback(course) {
            viewModel.addCourse(course.id);
            courseSelector.courseAddedToPath(course);
            app.trigger(constants.messages.learningPath.createCourse, course);
        }

        function createNewCourse() {
            eventTracker.publish(events.createNewCourse);
            createCourseDialog.show(viewModel.createCourseCallback);
        }

        function updateCoursesOrder() {
            eventTracker.publish(events.changeCoursesOrder);
            updateCoursesOrderCommand.execute(viewModel.id, viewModel.entities())
                .then(function () {
                    notify.saved();
                });
        }

        function courseTitleUpdated(course) {
            var courseBrief = _.find(viewModel.entities(), function (item) {
                return item.id === course.id;
            });

            if (!courseBrief)
                return;

            courseBrief.title(course.title);
        }

        function navigateToDetails(course) {
            eventTracker.publish(events.navigateToCourseDetails);
            router.navigate('courses/' + course.id);
        }

        function toggleAddCoursesPopoverVisibility() {
            viewModel.addCoursesPopoverVisibility(!viewModel.addCoursesPopoverVisibility());
        }

        function hideAddCoursesPopover() {
            viewModel.addCoursesPopoverVisibility(false);
        }
    }
);