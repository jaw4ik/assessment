define(['reporting/viewmodels/resultsBase', 'repositories/learningPathRepository', 'reporting/xApiProvider'],
    function (ResultsBase, learningPathRepository, xApiProvider) {
        "use strict";
         
        var viewModel = function () {
            var noResultsViewLocation = 'learningPaths/learningPath/results/noResults';
            ResultsBase.call(this, learningPathRepository.getById, null, xApiProvider.getLearningPathFinishedStatements, noResultsViewLocation);
        };

        return viewModel;
    }
);