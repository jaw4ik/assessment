﻿define(['reporting/viewmodels/objectiveStatement', 'reporting/viewmodels/courseStatement', 'reporting/viewmodels/expandableStatement'], function (ObjectiveStatement, CourseStatement, ExpandableStatement) {
    "use strict";
    describe('viewmodel [CourseStatement]', function () {
        var lrsStatement,
	        statement,
			masteredDefer,
            startedDefer,
	        xApiProvider = require('reporting/xApiProvider'),
            constants = require('constants'),
	        attemptId,
			statementId;

        beforeEach(function () {
            attemptId = 'attemptId';
            statementId = 'statementId';
            lrsStatement = { attemptId: attemptId, id: statementId, score: 50, actor: { name: 'name', email: 'email' } };
            spyOn(ExpandableStatement, 'call').and.callThrough();
            masteredDefer = Q.defer();
            startedDefer = Q.defer();
            spyOn(xApiProvider, 'getMasteredStatements').and.returnValue(masteredDefer.promise);
            spyOn(xApiProvider, 'getStartedStatement').and.returnValue(startedDefer.promise);
            statement = new CourseStatement(lrsStatement);
        });

        it('should be constructor function', function () {
            expect(CourseStatement).toBeFunction();
        });

        describe('[ctor]', function () {
            it('should call ctor of ExpandableStatement with proper args', function () {
                var args = ExpandableStatement.call.calls.mostRecent().args;
                expect(args[0]).toBe(statement);
                expect(args[1]).toBe(lrsStatement);
                expect(args[2]).toBe(statement.expandLoadAction);
            });

            it('should evaluate learnerDisplayName', function () {
                expect(statement.learnerDisplayName).toBe(statement.lrsStatement.actor.name + ' (' + statement.lrsStatement.actor.email + ')');
            });

            it('should set passed to true if statement verb is passed', function () {
                lrsStatement.verb = constants.reporting.xApiVerbIds.passed;
                statement = new CourseStatement(lrsStatement);
                expect(statement.passed).toBeTruthy();
            });

            it('should set passed to false if statement verb is not passed', function () {
                lrsStatement.verb = constants.reporting.xApiVerbIds.failed;
                statement = new CourseStatement(lrsStatement);
                expect(statement.passed).toBeFalsy();
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

            it('should call xApiProvider.getMasteredStatements with correct args', function () {
                statement.expandLoadAction();
                var args = xApiProvider.getMasteredStatements.calls.mostRecent().args;
                expect(args[0]).toBe(attemptId);
            });

            describe('when xApiProvider.getMasteredStatements call was success', function () {
                var masteredStatements = [
                        {
                            score: 50
                        }, {
                            score: 100
                        }
                ],
                    startedStatement = [{}];

                beforeEach(function () {
                    masteredDefer.resolve(masteredStatements);
                    startedDefer.resolve(startedStatement);
                });

                it('should call xApiProvider.getStartedStatement with correct args', function (done) {
                    statement.expandLoadAction().then(function () {
                        var args = xApiProvider.getStartedStatement.calls.mostRecent().args;
                        expect(args[0]).toBe(attemptId);
                        done();
                    });
                });

                describe('when xApiProvider.getStartedStatement call was sucess', function () {
                    it('should fill children collection with ObjectiveStatement instances', function (done) {
                        statement.expandLoadAction().fin(function () {
                            expect(statement.children().length).toBe(2);
                            expect(statement.children()[0]).toBeInstanceOf(ObjectiveStatement);
                            expect(statement.children()[1]).toBeInstanceOf(ObjectiveStatement);
                            expect(statement.children()[0].lrsStatement).toBe(masteredStatements[0]);
                            expect(statement.children()[1].lrsStatement).toBe(masteredStatements[1]);
                            done();
                        });
                    });

                    it('should set startedLrsStatement to started statement', function () {
                        statement.expandLoadAction().fin(function () {
                            expect(statement.startedLrsStatement).toBe(startedStatement[0]);
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
});