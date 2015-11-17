define(['reporting/viewmodels/resultsBase', 'repositories/courseRepository', 'reporting/courseStatementsProvider'],
    function (ResultsBase, courseRepository, courseStatementsProvider) {
        "use strict";

        var viewModel = function () {
            var noResultsViewLocation = 'courses/course/results/noResults';
            ResultsBase.call(this, courseRepository.getById, courseStatementsProvider.getLrsStatements, noResultsViewLocation, true);
        };

        return viewModel;
    }
);