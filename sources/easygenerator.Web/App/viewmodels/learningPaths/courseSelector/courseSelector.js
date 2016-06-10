define(['./queries/getOwnedCoursesQuery', 'viewmodels/learningPaths/courseSelector/courseBrief',
    './../learningPath/queries/getLearningPathByIdQuery', 'durandal/app', 'constants'],
    function (getOwnedCoursesQuery, CourseBrief, getLearningPathByIdQuery, app, constants) {
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
            filterValue: ko.observable(''),
            courseTitleUpdated: courseTitleUpdated
        };

        viewModel.filteredCourses = ko.computed(function () {
            if (_.isEmpty(viewModel.filterValue())) {
                return viewModel.courses();
            }

            return _.filter(viewModel.courses(), function (course) {
                return course.title().toLowerCase().indexOf(viewModel.filterValue().toLowerCase()) >= 0;
            });
        });

        return viewModel;

        function expand() {
            viewModel.filterValue('');
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