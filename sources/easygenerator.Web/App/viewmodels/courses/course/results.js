define(['reporting/viewmodels/resultsBase', 'repositories/courseRepository', 'reporting/courseStatementsProvider'],
    function (ResultsBase, courseRepository, courseStatementsProvider) {
        "use strict";

        var viewModel = {};

        var noResultsViewLocation = 'courses/course/results/noResults';
        ResultsBase.call(viewModel, courseRepository.getById, courseStatementsProvider.getLrsStatements, noResultsViewLocation);

        return viewModel;
    }
);