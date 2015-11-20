define(['dataContext', 'eventTracker', 'durandal/app', 'constants', 'repositories/courseRepository', 'widgets/dialog/viewmodel'],
    function (dataContext, eventTracker, app, constants, courseRepository, dialog) {
        var events = {
            confirmDelete: 'Confirm delete course',
            cancelDelete: 'Cancel delete course'
        };

        var viewModel = {
            isDeleting: ko.observable(false),
            courseId: '',
            courseTitle: ko.observable(''),
            learningPaths: ko.observableArray([]),
            deleteCourse: deleteCourse,
            show: show,
            cancel: cancel
        };

        viewModel.isCourseInLearningPaths = ko.computed(function () {
            return viewModel.learningPaths().length > 0;
        });

        return viewModel;
        

        function show(courseId, courseTitle) {
            viewModel.courseId = courseId;
            viewModel.courseTitle(courseTitle);

            var learningPaths = _.filter(dataContext.learningPaths, function (learningPath) {
                return _.some(learningPath.courses, function (learningPathCourse) {
                    return learningPathCourse.id === courseId;
                });
            });
            viewModel.learningPaths(learningPaths);
            dialog.show(viewModel, constants.dialogs.deleteCourse.settings);
        }

        function cancel() {
            eventTracker.publish(events.cancelDelete);
            dialog.close();
        }

        function deleteCourse() {
            viewModel.isDeleting(true);
            eventTracker.publish(events.confirmDelete);
            courseRepository.removeCourse(viewModel.courseId)
                .then(function () {
                    dialog.close();
                })
                .fin(function () {
                    viewModel.isDeleting(false);
                });
        }
    });