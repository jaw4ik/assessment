define(['reporting/viewmodels/objectiveStatement', 'reporting/viewmodels/questionStatement', 'reporting/viewmodels/expandableStatement'], function (ObjectiveStatement, QuestionStatement, ExpandableStatement) {
    "use strict";
    describe('viewmodel [ObjectiveStatement]', function () {
        var lrsStatement,
	        statement,
			defer,
	        xApiProvider = require('reporting/xApiProvider'),
	        attemptId,
			statementId;

        beforeEach(function () {
            attemptId = 'attemptId';
            statementId = 'statementId';
            lrsStatement = { attemptId: attemptId, id: statementId, score: 50 };
            spyOn(ExpandableStatement, 'call').and.callThrough();
            defer = Q.defer();
            spyOn(xApiProvider, 'getAnsweredStatements').and.returnValue(defer.promise);
            statement = new ObjectiveStatement(lrsStatement);
        });

        it('should be constructor function', function () {
            expect(ObjectiveStatement).toBeFunction();
        });

        describe('[ctor]', function () {
            it('should call ctor of ExpandableStatement with proper args', function () {
                expect(ExpandableStatement.call).toHaveBeenCalledWith(statement, lrsStatement, statement.expandLoadAction);
            });

            it('should set hasScore to true if lrsStatement.score is not null', function() {
                expect(statement.hasScore).toBeTruthy();
            });

            it('should set hasScore to false if lrsStatement.score is null', function () {
                lrsStatement.score = null;
                statement = new ObjectiveStatement(lrsStatement);
                expect(statement.hasScore).toBeFalsy();
            });
        });

        describe('[prototype]', function () {
            it('should have prototype of type ExpandableStatement', function () {
                expect(ExpandableStatement.prototype.isPrototypeOf(statement)).toBeTruthy();
            });
        });

        describe('[expandLoadAction]', function () {
            it('should return promise', function () {
                expect(statement.expandLoadAction()).toBePromise();
            });

            it('should call xApiProvider.getAnsweredStatements with correct args', function (done) {
                defer.resolve([]);
                statement.expandLoadAction().fin(function () {
                    expect(xApiProvider.getAnsweredStatements).toHaveBeenCalledWith(attemptId, statementId);
                    done();
                });
            });

            describe('if there are no answered statements', function () {
                beforeEach(function () {
                    defer.resolve([]);
                });

                it('should set children to null', function (done) {
                    statement.expandLoadAction().fin(function () {
                        expect(statement.children).toBeNull();
                        done();
                    });
                });

                it('should set isExpanded to true', function (done) {
                    statement.expandLoadAction().fin(function () {
                        expect(statement.isExpanded()).toBeTruthy();
                        done();
                    });
                });
            });

            describe('when answered statements were returned', function () {
                var answeredStatements;
                beforeEach(function () {
                    answeredStatements = [
					{
					    score: 50
					}, {
					    score: 100
					}];
                    defer.resolve(answeredStatements);
                });

                it('should fill children collection with QuestionStatement instances', function (done) {
                    statement.expandLoadAction().fin(function () {
                        expect(statement.children().length).toBe(2);
                        expect(statement.children()[0]).toBeInstanceOf(QuestionStatement);
                        expect(statement.children()[1]).toBeInstanceOf(QuestionStatement);
                        expect(statement.children()[0].lrsStatement).toBe(answeredStatements[0]);
                        expect(statement.children()[1].lrsStatement).toBe(answeredStatements[1]);
                        done();
                    });
                });

                it('should set isExpanded to true', function (done) {
                    statement.expandLoadAction().fin(function () {
                        expect(statement.isExpanded()).toBeTruthy();
                        done();
                    });
                });
            });
        });
    });
});