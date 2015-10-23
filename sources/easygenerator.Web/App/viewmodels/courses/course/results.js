define(['reporting/viewmodels/resultsBase', 'repositories/courseRepository', 'reporting/xApiProvider'],
    function (ResultsBase, courseRepository, xApiProvider) {
        "use strict";

        var viewModel = function () {
            var noResultsViewLocation = 'courses/course/results/noResults';
            ResultsBase.call(this, courseRepository.getById, xApiProvider.getCourseStartedStatements, xApiProvider.getCourseFinishedStatements, noResultsViewLocation);
        };

        return viewModel;
    }
);