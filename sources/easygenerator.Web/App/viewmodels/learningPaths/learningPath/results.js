define(['reporting/viewmodels/resultsBase', 'repositories/learningPathRepository', 'reporting/learningPathStatementsProvider', 'reporting/viewmodels/finishStatement'],
    function (ResultsBase, learningPathRepository, learningPathStatementsProvider) {
        "use strict";

        var viewModel = {};

        var noResultsViewLocation = 'learningPaths/learningPath/results/noResults';
        ResultsBase.call(viewModel, learningPathRepository.getById, learningPathStatementsProvider.getLrsStatements, noResultsViewLocation);

        return viewModel;
    }
);