define(['reporting/viewmodels/resultsBase', 'repositories/learningPathRepository', 'reporting/learningPathStatementsProvider', 'viewmodels/learningPaths/learningPath/results'],
    function (ResultsBase, learningPathRepository, LearningPathStatementsProvider, Results) {
        "use strict";

        describe('[Results]', function () {

            it('should be defined', function () {
                expect(Results).toBeDefined();
            });

        });
    });