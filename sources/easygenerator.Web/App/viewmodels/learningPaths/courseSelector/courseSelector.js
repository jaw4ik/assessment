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
            courseRemovedFromPath: courseRemovedFromPath,
            courseAddedToPath: courseAddedToPath,
            filter: courseFilter,
            courseTitleUpdated: courseTitleUpdated
        };

        viewModel.filteredCourses = ko.computed(function () {
            if (!viewModel.filter.hasValue()) {
                return viewModel.courses();
            }

            var value = viewModel.filter.value();
            return _.filter(viewModel.courses(), function (course) {
                return course.title().toLowerCase().indexOf(value.toLowerCase()) >= 0;
            });
        });

        return viewModel;

        function expand() {
            viewModel.filter.clear();
            viewModel.isExpanded(true);
        }

        function collapse() {
            viewModel.isExpanded(false);
        }

        function activate(learningPathId) {
            app.on(constants.messages.learningPath.removeCourse, viewModel.courseRemovedFromPath);
            app.on(constants.messages.course.titleUpdatedByCollaborator, viewModel.courseTitleUpdated);

            return getLearningPathByIdQuery.execute(learningPathId)
                .then(function (learningPath) {
                    return getOwnedCoursesQuery.execute()
                        .then(function (courses) {
                            var collection = _.chain(courses)
                                .sortBy(function (item) { return -item.createdOn; })
                                .map(function (item) {
                                    return mapCourseBrief(item, learningPath.entities);
                                }).value();

                            viewModel.courses(collection);
                        });
                });
        }

        function deactivate() {
            app.off(constants.messages.learningPath.removeCourse, viewModel.courseRemovedFromPath);
            app.off(constants.messages.course.titleUpdatedByCollaborator, viewModel.courseTitleUpdated);
        }

        function mapCourseBrief(course, attachedCourses) {
            var courseBrief = new CourseBrief(course);
            var isSelected = _.some(attachedCourses, function (attachedCourse) {
                return courseBrief.id === attachedCourse.id;
            });

            courseBrief.isSelected(isSelected);
            return courseBrief;
        }

        function courseRemovedFromPath(courseId) {
            var course = _.find(viewModel.courses(), function (item) {
                return item.id === courseId;
            });

            if (course) {
                course.isSelected(false);
            }
        }

        function courseAddedToPath(course) {
            var courseBrief = new CourseBrief(course);
            courseBrief.isSelected(true);
            viewModel.courses.unshift(courseBrief);
        }

        function courseTitleUpdated(course) {
            var courseBrief = _.find(viewModel.courses(), function (item) {
                return item.id === course.id;
            });

            if (!courseBrief)
                return;

            courseBrief.title(course.title);
        }
    });