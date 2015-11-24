import StartedStatement from 'reporting/viewmodels/startedStatement';
import ExpandableStatement from 'reporting/viewmodels/expandableStatement';

describe('viewmodel [StartedStatement]', () => {
    var lrsStatement,
	    statement,
	    attemptId,
		statementId;

    beforeEach(() => {
        attemptId = 'attemptId';
        statementId = 'statementId';
        lrsStatement = { attemptId: attemptId, id: statementId, score: null, actor: { name: 'name', email: 'email' } };
        statement = new StartedStatement(lrsStatement);
    });

    it('should be class', () => {
        expect(StartedStatement).toBeFunction();
    });

    describe('[class]', () => {
        it('should extends ExpandableStatement', () => {
            expect(statement).toBeInstanceOf(ExpandableStatement);
        });

        it('should evaluate learnerDisplayName', () => {
            expect(statement.learnerDisplayName).toBe(`${statement.lrsStatement.actor.name} (${statement.lrsStatement.actor.email})`);
        });

        it('should set isExpandable to false', () => {
            statement = new StartedStatement(lrsStatement);
            expect(statement.isExpandable).toBeFalsy();
        });

        it('should set isExpanded to null', () => {
            statement = new StartedStatement(lrsStatement);
            expect(statement.isExpanded).toBeNull();
        });

        it('should set children to null', () => {
            statement = new StartedStatement(lrsStatement);
            expect(statement.children).toBeNull();
        });

    });

});