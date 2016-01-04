define(['reporting/viewmodels/resultsBase', 'repositories/courseRepository', 'reporting/courseStatementsProvider'],
    function (ResultsBase, courseRepository, CourseStatementsProvider) {
        "use strict";

        var viewModel = {};

        var noResultsViewLocation = 'courses/course/results/noResults';
        ResultsBase.call(viewModel, courseRepository.getById, CourseStatementsProvider.getLrsStatements, noResultsViewLocation, true);

        return viewModel;
    }
);