define(['reporting/viewmodels/resultsBase', 'repositories/learningPathRepository', 'reporting/learningPathStatementsProvider'],
    function (ResultsBase, learningPathRepository, LearningPathStatementsProvider) {
        "use strict";

        var viewModel = {};

        var noResultsViewLocation = 'learningPaths/learningPath/results/noResults';
        ResultsBase.call(viewModel, learningPathRepository.getById, LearningPathStatementsProvider.getLrsStatements, noResultsViewLocation);

        return viewModel;
    }
);