define(['viewmodels/learningPaths/learningPath/queries/getLearningPathByIdQuery', 'plugins/router', 'constants', 'localization/localizationManager',
 'eventTracker', 'viewmodels/learningPaths/courseSelector/courseSelector',
 'durandal/app', 'viewmodels/learningPaths/learningPath/courseBrief', 'viewmodels/learningPaths/learningPath/commands/addCourseCommand',
'viewmodels/learningPaths/learningPath/commands/removeCourseCommand', 'repositories/courseRepository', 'notify', 'viewmodels/learningPaths/learningPath/commands/updateCoursesOrderCommand',
'knockout'],
    function (getLearningPathByIdQuery, router, constants, localizationManager, eventTracker, courseSelector, app, CourseBrief,
         addCourseCommand, removeCourseCommand, courseRepository, notify, updateCoursesOrderCommand, ko) {
        "use strict";

        var
            events = {
                navigateToLearningPaths: 'Navigate to learning paths',
                addCourse: 'Add course to the learning path',
                removeCourse: 'Remove course from the learning path',
                showAvailableCourses: 'Show courses available for the learning path (Add courses)',
                hideAvailableCourses: 'Hide courses available for the learning path (Done)',
                changeCoursesOrder: 'Change order of courses'
            },
            viewModel = {
                id: null,
                activate: activate,
                deactivate: deactivate,
                back: back,
                addCourses: addCourses,
                finishAddingCourses: finishAddingCourses,
                courseSelector: courseSelector,
                addCourse: addCourse,
                removeCourse: removeCourse,
                courses: ko.observableArray([]),
                currentLanguage: '',
                updateCoursesOrder: updateCoursesOrder,
                courseTitleUpdated: courseTitleUpdated
            };

        viewModel.isSortingEnabled = ko.computed(function () {
            return viewModel.courses().length > 1;
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
            app.on(constants.messages.course.titleUpdatedByCollaborator, viewModel.courseTitleUpdated);

            return getLearningPathByIdQuery.execute(viewModel.id).then(function (learningPath) {
                viewModel.courseSelector.isExpanded(learningPath.courses.length === 0);
                
                var collection = _.chain(learningPath.courses)
                     .map(function (item) {
                         return new CourseBrief(item);
                     }).value();

                viewModel.courses(collection);
            });
        }

        function deactivate() {
            app.off(constants.messages.learningPath.courseSelector.courseSelected, viewModel.addCourse);
            app.off(constants.messages.learningPath.courseSelector.courseDeselected, viewModel.removeCourse);
            app.off(constants.messages.learningPath.removeCourse, viewModel.removeCourse);
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

        function addCourse(courseId) {
            eventTracker.publish(events.addCourse);
            courseRepository.getById(courseId).then(function (course) {
                viewModel.courses.push(new CourseBrief(course));
            });

            addCourseCommand.execute(viewModel.id, courseId).then(function () {
                notify.saved();
            });
        }

        function removeCourse(courseId) {
            eventTracker.publish(events.removeCourse);
            viewModel.courses(_.reject(viewModel.courses(), function (item) {
                return item.id === courseId;
            }));

            if (!viewModel.courseSelector.isExpanded() && viewModel.courses().length === 0) {
                viewModel.courseSelector.expand();
            }

            removeCourseCommand.execute(viewModel.id, courseId).then(function () {
                notify.saved();
            });
        }

        function updateCoursesOrder() {
            eventTracker.publish(events.changeCoursesOrder);
            updateCoursesOrderCommand.execute(viewModel.id, viewModel.courses())
                .then(function () {
                    notify.saved();
                });
        }

        function courseTitleUpdated(course) {
            var courseBrief = _.find(viewModel.courses(), function (item) {
                return item.id === course.id;
            });

            if (!courseBrief)
                return;

            courseBrief.title(course.title);
        }
    }
);