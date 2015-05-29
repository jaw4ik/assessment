define(['viewmodels/learningPaths/learningPath/queries/getLearningPathByIdQuery', 'plugins/router', 'viewmodels/common/titleField', 'constants', 'localization/localizationManager',
 'clientContext', 'viewmodels/learningPaths/learningPath/commands/updateLearningPathTitleCommand', 'eventTracker', 'viewmodels/learningPaths/courseSelector/courseSelector',
 'durandal/app', 'viewmodels/learningPaths/learningPath/courseBrief', 'repositories/courseRepository'],
    function (getLearningPathByIdQuery, router, titleField, constants, localizationManager, clientContext, updateTitleCommand, eventTracker, courseSelector, app, CourseBrief,
        courseRepository) {
        "use strict";

        var
            events = {
                updateTitle: 'Update learning path title',
                navigateToLearningPaths: 'Navigate to learning paths'
            },
            viewModel = {
                id: null,
                title: ko.observable(''),
                activate: activate,
                canActivate: canActivate,
                deactivate: deactivate,
                back: back,
                addCourses: addCourses,
                finishAddingCourses: finishAddingCourses,
                courseSelector: courseSelector,
                addCourse: addCourse,
                removeCourse: removeCourse,
                courses: ko.observableArray([]),
                currentLanguage: ''
            };

        viewModel.titleField = titleField('', constants.validation.learningPathTitleMaxLength, localizationManager.localize('learningPathTitle'), getTitle, updateTitle);

        return viewModel;

        function back() {
            eventTracker.publish(events.navigateToLearningPaths);
            router.navigate('#learningpaths');
        }

        function canActivate(learningPathId) {
            return getLearningPathByIdQuery.execute(learningPathId)
                .then(function (learningPath) {
                    if (_.isObject(learningPath)) {
                        return true;
                    }

                    return { redirect: '404' };
                });
        }

        function activate(learningPathId) {
            viewModel.id = learningPathId;

            viewModel.currentLanguage = localizationManager.currentLanguage;

            app.on(constants.messages.learningPath.addCourse, viewModel.addCourse);
            app.on(constants.messages.learningPath.removeCourse, viewModel.removeCourse);

            return getLearningPathByIdQuery.execute(viewModel.id).then(function (learningPath) {
                viewModel.titleField.title(learningPath.title);
                viewModel.titleField.isSelected(clientContext.get(constants.clientContextKeys.lastCreatedLearningPathId) === learningPath.id);
                clientContext.remove(constants.clientContextKeys.lastCreatedLearningPathId);
            });
        }

        function deactivate() {
            app.off(constants.messages.learningPath.addCourse, viewModel.addCourse);
            app.off(constants.messages.learningPath.removeCourse, viewModel.removeCourse);
        }

        function getTitle() {
            return getLearningPathByIdQuery.execute(viewModel.id).then(function (learningPath) {
                return learningPath.title;
            });
        }

        function updateTitle(title) {
            eventTracker.publish(events.updateTitle);
            return updateTitleCommand.execute(viewModel.id, title);
        }

        function addCourses() {
            courseSelector.expand();
        }

        function finishAddingCourses() {
            courseSelector.collapse();
        }

        function addCourse(courseId) {
            courseRepository.getById(courseId).then(function (course) {
                viewModel.courses.push(new CourseBrief(course));
            });
        }

        function removeCourse(courseId) {
            viewModel.courses(_.reject(viewModel.courses(), function (item) {
                return item.id === courseId;
            }));
        }
    }
);