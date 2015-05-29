define(['durandal/app', 'constants'],
    function (app, constants) {
        "use strict";

        return function (course) {

            var viewModel = {
                id: course.id,
                title: ko.observable(course.title),
                createdOn: course.createdOn,
                isSelected: ko.observable(false),
                toggleSelection: toggleSelection
            };

            return viewModel;

            function toggleSelection() {
                app.trigger(viewModel.isSelected() ?
                    constants.messages.learningPath.removeCourse : constants.messages.learningPath.addCourse,
                    viewModel.id);

                viewModel.isSelected(!viewModel.isSelected());
            }
        };
    }
);