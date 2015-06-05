define(['viewmodels/learningPaths/courseSelector/queries/getOwnedCoursesQuery', 'viewmodels/learningPaths/courseSelector/courseBrief',
    'viewmodels/learningPaths/learningPath/queries/getLearningPathByIdQuery', 'durandal/app', 'constants', 'viewmodels/learningPaths/courseSelector/courseFilter'],
    function (getOwnedCoursesQuery, CourseBrief, getLearningPathByIdQuery, app, constants, courseFilter) {
        "use strict";

        var viewModel = {
            isExpanded: ko.observable(false),
            expand: expand,
            collapse: collapse,
            activate: activate,
            deactivate: deactivate,
            courses: ko.observableArray([]),
            courseRemoved: courseRemoved,
            filter: courseFilter
        };

        viewModel.filteredCourses = ko.computed(function () {
            if (!viewModel.filter.hasValue()) {
                return viewModel.courses();
            }

            var value = viewModel.filter.value();
            return _.filter(viewModel.courses(), function (course) {
                return course.title().toLowerCase().indexOf(value.toLowerCase()) === 0;
            });
        });

        return viewModel;

        function expand() {
            viewModel.isExpanded(true);
        }

        function collapse() {
            viewModel.isExpanded(false);
        }

        function activate(learningPathId) {
            app.on(constants.messages.learningPath.removeCourse, viewModel.courseRemoved);

            return getLearningPathByIdQuery.execute(learningPathId)
                .then(function (learningPath) {
                    return getOwnedCoursesQuery.execute()
                        .then(function (courses) {
                            var collection = _.chain(courses)
                                .sortBy(function (item) { return -item.createdOn; })
                                .map(function (item) {
                                    return mapCourseBrief(item, learningPath.courses);
                                }).value();

                            viewModel.courses(collection);
                        });
                });
        }

        function deactivate() {
            app.off(constants.messages.learningPath.removeCourse, viewModel.courseRemoved);
        }

        function mapCourseBrief(course, attachedCourses) {
            var courseBrief = new CourseBrief(course);
            var isSelected = _.some(attachedCourses, function (attachedCourse) {
                return courseBrief.id === attachedCourse.id;
            });

            courseBrief.isSelected(isSelected);
            return courseBrief;
        }

        function courseRemoved(courseId) {
            var course = _.find(viewModel.courses(), function (item) {
                return item.id === courseId;
            });

            if (course) {
                course.isSelected(false);
            }
        }
    });