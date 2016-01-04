define(['reporting/viewmodels/resultsBase', 'repositories/courseRepository', 'reporting/courseStatementsProvider', 'viewmodels/courses/course/results'],
    function (ResultsBase, courseRepository, CourseStatementsProvider, results) {
        "use strict";

        describe('[Results]', function () {

            it('should be defined', function () {
                expect(results).toBeDefined();
            });

        });

    }
);
