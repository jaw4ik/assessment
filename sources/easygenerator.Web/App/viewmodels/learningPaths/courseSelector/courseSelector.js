define(['viewmodels/learningPaths/courseSelector/queries/getOwnedCoursesQuery', 'viewmodels/learningPaths/courseSelector/courseBrief',
    'viewmodels/learningPaths/learningPath/queries/getLearningPathByIdQuery'],
    function (getOwnedCoursesQuery, CourseBrief, getLearningPathByIdQuery) {
        "use strict";

        var viewModel = {
            isExpanded: ko.observable(false),
            expand: expand,
            collapse: collapse,
            activate: activate,
            courses: ko.observableArray([])
        };

        return viewModel;

        function expand() {
            viewModel.isExpanded(true);
        }

        function collapse() {
            viewModel.isExpanded(false);
        }

        function activate(learningPathId) {
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

        function mapCourseBrief(course, attachedCourses) {
            var courseBrief = new CourseBrief(course);
            var isSelected = _.some(attachedCourses, function (attachedCourse) {
                return courseBrief.id === attachedCourse.id;
            });

            courseBrief.isSelected(isSelected);
            return courseBrief;
        }
    });