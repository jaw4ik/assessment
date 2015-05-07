define(['reporting/viewmodels/questionStatement', 'reporting/viewmodels/expandableStatement'], function (QuestionStatement, ExpandableStatement) {
    "use strict";
    describe('viewmodel [QuestionStatement]', function () {

        it('should be constructor function', function () {
            expect(QuestionStatement).toBeFunction();
        });

        describe('[ctor]', function () {
            var lrsStatement,
                statement;

            beforeEach(function () {
                lrsStatement = {
                    score: 50
                };
                spyOn(ExpandableStatement, 'call').and.callThrough();
                statement = new QuestionStatement(lrsStatement);
            });

            it('should call ctor of ExpandableStatement with proper args', function () {
                expect(ExpandableStatement.call).toHaveBeenCalledWith(statement, lrsStatement, null);
            });

            it('should set isExpandable to false', function () {
                lrsStatement.attemptId = 'attemptId';
                statement = new QuestionStatement(lrsStatement);
                expect(statement.isExpandable).toBeFalsy();
            });

            it('should set isExpanded to null', function () {
                expect(statement.isExpanded).toBeNull();
            });

            it('should set children to null', function () {
                expect(statement.children).toBeNull();
            });

            describe('when lrsStatement.score is 100', function () {
                it('should set correct prop to true', function () {
                    lrsStatement.score = 100;
                    statement = new QuestionStatement(lrsStatement);
                    expect(statement.correct).toBeTruthy();
                });
            });

            describe('when lrsStatement.score does not equal to 100', function () {
                it('should set correct prop to false', function () {
                    expect(statement.correct).toBeFalsy();
                });
            });
        });
    });
});