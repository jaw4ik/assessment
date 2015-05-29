define(['viewmodels/learningPaths/courseSelector/queries/getOwnedCoursesQuery', 'viewmodels/learningPaths/courseSelector/courseBrief'],
    function (getOwnedCoursesQuery, CourseBrief) {
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

        function activate() {
            return getOwnedCoursesQuery.execute()
                .then(function (courses) {
                    var collection = _.chain(courses)
                        .sortBy(function (item) { return -item.createdOn; })
                        .map(function (item) {
                            return new CourseBrief(item);
                        }).value();

                    viewModel.courses(collection);
                });
        }
    });