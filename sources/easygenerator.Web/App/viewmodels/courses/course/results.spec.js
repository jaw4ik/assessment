define(['reporting/viewmodels/resultsBase', 'repositories/courseRepository', 'reporting/courseStatementsProvider', 'viewmodels/courses/course/results'],
    function (ResultsBase, courseRepository, courseStatementsProvider, Results) {
        "use strict";

        describe('[Results]', function () {

            it('should be constructor function', function () {
                expect(Results).toBeFunction();
            });

            describe('[ctor]', function () {

                beforeEach(function () {
                    spyOn(ResultsBase, 'call').and.callThrough();
                });

                it('should call ctor of ResultsBase with proper args', function () {
                    var instance = new Results();
                    expect(ResultsBase.call).toHaveBeenCalledWith(instance, courseRepository.getById, courseStatementsProvider.getLrsStatements, 'courses/course/results/noResults', true);
                });

            });
        });
    });