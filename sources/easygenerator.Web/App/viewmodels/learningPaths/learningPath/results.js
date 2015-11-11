define(['reporting/viewmodels/resultsBase', 'repositories/learningPathRepository', 'reporting/learningPathStatementsProvider', 'reporting/viewmodels/finishStatement'],
    function (ResultsBase, learningPathRepository, learningPathStatementsProvider) {
        "use strict";

        var viewModel = function () {
            var noResultsViewLocation = 'learningPaths/learningPath/results/noResults';
            ResultsBase.call(this, learningPathRepository.getById, learningPathStatementsProvider.getLrsStatements, noResultsViewLocation);
        };

        return viewModel;
    }
);