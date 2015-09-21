define(['reporting/viewmodels/resultsBase', 'repositories/learningPathRepository', 'reporting/xApiProvider'],
    function (ResultsBase, learningPathRepository, xApiProvider) {
        "use strict";
         
        var viewModel = function () {
            var noResultsViewLocation = 'learningPaths/learningPath/results/noResults';
            ResultsBase.call(this, learningPathRepository.getById, xApiProvider.getLearningPathCompletedStatements, noResultsViewLocation);
        };

        return viewModel;
    }
);