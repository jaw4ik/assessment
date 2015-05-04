define(['reporting/viewmodels/ObjectiveStatement', 'reporting/viewmodels/QuestionStatement', 'reporting/viewmodels/expandableStatement'], function (ObjectiveStatement, QuestionStatement, ExpandableStatement) {
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
				var args = ExpandableStatement.call.calls.mostRecent().args;
				expect(args[0]).toBe(statement);
				expect(args[1]).toBe(lrsStatement);
				expect(args[2]).toBe(statement.expandLoadAction);
			});
		});

		describe('[prototype]', function () {
			it('should have prototype of type ExpandableStatement', function () {
				expect(ExpandableStatement.prototype.isPrototypeOf(statement)).toBeTruthy();
			});
		});

		describe('[constructor]', function () {
			it('should be instance of ObjectiveStatement', function () {
				expect(ObjectiveStatement.constructor).toBe(ObjectiveStatement);
			});
		});

		describe('[expandLoadAction]', function () {
			it('should return promise', function () {
				expect(statement.expandLoadAction()).toBePromise();
			});

			it('should call xApiProvider.getAnsweredStatements with correct args', function () {
				statement.expandLoadAction();
				var args = xApiProvider.getAnsweredStatements.calls.mostRecent().args;
				expect(args[0]).toBe(attemptId);
				expect(args[1]).toBe(statementId);
			});

			describe('if there are no answered statements', function () {
				beforeEach(function () {
					defer.resolve([]);
				});

				it('should set children to null', function (done) {
					statement.expandLoadAction().then(function () {
						expect(statement.children).toBeNull();
						done();
					});
				});

				it('should set isExpanded to true', function () {
					statement.expandLoadAction().then(function () {
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

				it('should fill children collection with ObjectiveStatement instances', function () {
					statement.expandLoadAction().then(function () {
						expect(statement.children().length).toBe(2);
						expect(statement.children()[0]).toBeInstanceOf(QuestionStatement);
						expect(statement.children()[1]).toBeInstanceOf(QuestionStatement);
						expect(statement.children()[0].lrsStatement).toBeInstanceOf(answeredStatements[0]);
						expect(statement.children()[1].lrsStatement).toBeInstanceOf(answeredStatements[1]);
						done();
					});
				});

				it('should set isExpanded to true', function () {
					statement.expandLoadAction().then(function () {
						expect(statement.isExpanded()).toBeTruthy();
						done();
					});
				});
			});
		});
	});
});