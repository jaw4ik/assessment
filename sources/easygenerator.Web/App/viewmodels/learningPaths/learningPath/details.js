define(['viewmodels/learningPaths/learningPath/queries/getLearningPathByIdQuery', 'plugins/router', 'constants', 'localization/localizationManager', 'eventTracker', 'viewmodels/learningPaths/courseSelector/courseSelector', 'models/course', 'models/document',
'durandal/app', 'viewmodels/learningPaths/learningPath/courseBrief', 'viewmodels/learningPaths/learningPath/documentBrief', 'viewmodels/learningPaths/learningPath/commands/addCourseCommand', 'viewmodels/learningPaths/learningPath/commands/removeCourseCommand', 'viewmodels/learningPaths/learningPath/commands/removeDocumentCommand', 'repositories/courseRepository', 'notify',
'viewmodels/learningPaths/learningPath/commands/updateEntitiesOrderCommand', 'dialogs/course/createCourse/createCourse', 'dialogs/document/create/index', 'commands/createDocumentCommand', 'commands/updateDocumentCommand', 'viewmodels/learningPaths/learningPath/commands/addDocumentCommand', 'knockout'],
    function (getLearningPathByIdQuery, router, constants, localizationManager, eventTracker, courseSelector, CourseModel, DocumentModel, app, CourseBrief, DocumentBrief,
         addCourseCommand, removeCourseCommand, removeDocumentCommand, courseRepository, notify, updateEntitiesOrderCommand, createCourseDialog, createDocumentDialog, createDocumentCommand, updateDocumentCommand, addDocumentCommand, ko) {
        "use strict";

        var
            events = {
                navigateToLearningPaths: 'Navigate to learning paths',
                addCourse: 'Add course to the learning path',
                removeCourse: 'Remove course from the learning path',
                showAvailableCourses: 'Show courses available for the learning path (Add courses)',
                createNewCourse: 'Open \'Create course\' dialog',
                hideAvailableCourses: 'Hide courses available for the learning path (Done)',
                changeEntitiesOrder: 'Change order of courses',
                navigateToCourseDetails: 'Navigate to course details',

                addPowerPointDocument: 'Open \'Add PowerPoint document\' popup',
                addPdfDocument: 'Open \'Add PDF document\' popup',
                addOfficeDocument: 'Open \'Add Office documents\' popup',
                powerPointDocumentAdded: 'PowerPoint document added',
                pdfDocumentAdded: 'PDF document added',
                OfficeDocumentAdded: 'Office document added',
                cancelAddPowerPointDocument: 'Close \'Add PowerPoint document\' popup',
                cancelAddPdfDocument: 'Close \'Add PDF document\' popup',
                cancelAddOfficeDocument: 'Close \'Add Office document\' popup',
                updatePowerPointDocument: 'PowerPoint document updated',
                updatePdfDocument: 'PDF document updated',
                updateOfficeDocument: 'Office document updated',
                removePowerPointDocument: 'Remove PowerPoint document',
                removePdfDocument: 'Remove Pdf document',
                removeOfficeDocument: 'Remove Office document'
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
                removeDocument: removeDocument,
                entities: ko.observableArray([]),
                isCourse: isCourse,
                addCoursesPopoverVisibility: ko.observable(false),
                currentLanguage: '',
                updateEntitiesOrder: updateEntitiesOrder,
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
            app.on(constants.messages.learningPath.removeDocument, viewModel.removeDocument);

            return getLearningPathByIdQuery.execute(viewModel.id).then(function (learningPath) {
                viewModel.courseSelector.isExpanded(learningPath.entities.length === 0);

                var collection = _.chain(learningPath.entities)
                     .map(function (item) {
                         if (item instanceof CourseModel) {
                             return new CourseBrief(item);
                         }
                         return new DocumentBrief(item);
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
            app.on(constants.messages.learningPath.removeDocument, viewModel.removeDocument);
        }

        function isCourse(entity) {
            return entity instanceof CourseBrief;
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
            createDocumentDialog.show(cancelEvent, function (title, embedCode) {
                if (title && embedCode) {
                    createDocumentCommand.execute(type, title, embedCode).then(function (document) {
                        viewModel.entities.push(new DocumentBrief(document));
                        addDocumentCommand.execute(viewModel.id, document.id).then(function () {
                            eventTracker.publish(finishEvent);
                            notify.saved();
                        });
                    });
                }
            });
        }

        function updateDocument(document, openDialogEvent, finishEvent, cancelEvent) {
            var _title = document.title(),
                _embedCode = document.embedCode();

            eventTracker.publish(openDialogEvent);
            createDocumentDialog.show(cancelEvent, function (title, embedCode) {

                title && document.title(title);
                embedCode && document.embedCode(embedCode);

                updateDocumentCommand.execute(document.id, title !== _title ? title : null, embedCode !== _embedCode ? embedCode : null).then(function (modifiedOn) {
                    if (!modifiedOn) {
                        return;
                    }
                    document.modifiedOn(modifiedOn);
                    eventTracker.publish(finishEvent);
                    notify.saved();
                });

            }, _title, _embedCode);
        }

        function editDocument(document) {
            switch (document.type) {
                case constants.documentType.powerPoint:
                    {
                        updateDocument(document, events.addPowerPointDocument, events.updatePowerPointDocument, events.cancelAddPowerPointDocument);
                        break;
                    }
                case constants.documentType.pdf:
                    {
                        updateDocument(document, events.addPdfDocument, events.updatePdfDocument, events.cancelAddPdfDocument);
                        break;
                    }
                case constants.documentType.office:
                    {
                        updateDocument(document, events.addOfficeDocument, events.updateOfficeDocument, events.cancelAddOfficeDocument);
                        break;
                    }
                default:
                    return;
            }
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

        function removeDocument(documentId) {
            var document = _.find(viewModel.entities(), function(item) {
                return item.id === documentId;
            });
            if (!document) {
                return;
            }
            var removeEvent;
            switch (document.type) {
                case constants.documentType.powerPoint:
                    {
                        removeEvent = events.removePowerPointDocument;
                        break;
                    }
                case constants.documentType.pdf:
                    {
                        removeEvent = events.removePdfDocument;
                        break;
                    }
                case constants.documentType.office:
                    {
                        removeEvent = events.removeOfficeDocument;
                        break;
                    }
                default:
                    return;
            }
            eventTracker.publish(removeEvent);
            viewModel.entities(_.reject(viewModel.entities(), function (item) {
                return item.id === documentId;
            }));
            removeDocumentCommand.execute(documentId).then(function() {
                notify.saved();
            });
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

        function updateEntitiesOrder() {
            eventTracker.publish(events.changeEntitiesOrder);
            updateEntitiesOrderCommand.execute(viewModel.id, viewModel.entities())
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

        function navigateToDetails(entity) {
            if (entity instanceof CourseBrief) {
                eventTracker.publish(events.navigateToCourseDetails);
                router.navigate('courses/' + entity.id);
                return;
            }
            editDocument(entity);
        }

        function toggleAddCoursesPopoverVisibility() {
            viewModel.addCoursesPopoverVisibility(!viewModel.addCoursesPopoverVisibility());
        }

        function hideAddCoursesPopover() {
            viewModel.addCoursesPopoverVisibility(false);
        }
    }
);