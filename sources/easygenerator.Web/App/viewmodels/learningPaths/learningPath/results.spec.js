define(['reporting/viewmodels/resultsBase', 'repositories/learningPathRepository', 'reporting/learningPathStatementsProvider', 'viewmodels/learningPaths/learningPath/results'],
    function (ResultsBase, learningPathRepository, learningPathStatementsProvider, Results) {
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
                    expect(ResultsBase.call).toHaveBeenCalledWith(instance, learningPathRepository.getById, learningPathStatementsProvider.getLrsStatements, 'learningPaths/learningPath/results/noResults');
                });

            });
        });
    });