define(['reporting/viewmodels/startedStatement'], function (StartedStatement) {
    "use strict";

    var ExpandableStatement = require('reporting/viewmodels/expandableStatement');

    describe('viewmodel [StartedStatement]', function () {
        var lrsStatement,
	        statement,
	        attemptId,
			statementId;

        beforeEach(function () {
            attemptId = 'attemptId';
            statementId = 'statementId';
            lrsStatement = { attemptId: attemptId, id: statementId, score: null, actor: { name: 'name', email: 'email' } };
            spyOn(ExpandableStatement, 'call').and.callThrough();
            statement = new StartedStatement(lrsStatement);
        });

        it('should be constructor function', function () {
            expect(StartedStatement).toBeFunction();
        });

        describe('[ctor]', function () {
            it('should call ctor of ExpandableStatement with proper args', function () {
                expect(ExpandableStatement.call).toHaveBeenCalledWith(statement, lrsStatement, null);
            });

            it('should evaluate learnerDisplayName', function () {
                expect(statement.learnerDisplayName).toBe(statement.lrsStatement.actor.name + ' (' + statement.lrsStatement.actor.email + ')');
            });

            it('should set isExpandable to false', function () {
                statement = new StartedStatement(lrsStatement);
                expect(statement.isExpandable).toBeFalsy();
            });

            it('should set isExpanded to null', function () {
                statement = new StartedStatement(lrsStatement);
                expect(statement.isExpanded).toBeNull();
            });

            it('should set children to null', function () {
                statement = new StartedStatement(lrsStatement);
                expect(statement.children).toBeNull();
            });

        });

    });

});