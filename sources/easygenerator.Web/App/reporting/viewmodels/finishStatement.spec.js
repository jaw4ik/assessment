import co from 'co';
import FinishStatement from 'reporting/viewmodels/finishStatement';
import ExpandableStatement from 'reporting/viewmodels/expandableStatement';
import ObjectiveStatement from 'reporting/viewmodels/objectiveStatement';
import xApiProvider from 'reporting/xApiProvider';
import constants from 'constants';

describe('viewmodel [FinishStatement]', () => {
    var lrsStatement,
	    statement,
	    attemptId,
		statementId,
        masteredStatements = [
            {
                score: 50
            }, {
                score: 100
            }
        ],
        startedStatement = [{}];

    beforeEach(() => {
        attemptId = 'attemptId';
        statementId = 'statementId';
        lrsStatement = { attemptId: attemptId, id: statementId, score: 50, actor: { name: 'name', email: 'email' } };
        spyOn(xApiProvider, 'getMasteredStatements').and.returnValue(Promise.resolve(masteredStatements));
        spyOn(xApiProvider, 'getStartedStatement').and.returnValue(Promise.resolve(startedStatement));
        statement = new FinishStatement(lrsStatement);
    });

    it('should be class', () => {
        expect(FinishStatement).toBeFunction();
    });

    describe('[class]', () => {
        it('should extends ExpandableStatement', () => {
            expect(statement).toBeInstanceOf(ExpandableStatement);
        });

        it('should evaluate learnerDisplayName', () => {
            expect(statement.learnerDisplayName).toBe(`${statement.lrsStatement.actor.name} (${statement.lrsStatement.actor.email})`);
        });

        it('should set passed to true if statement verb is passed', () => {
            lrsStatement.verb = constants.reporting.xApiVerbIds.passed;
            statement = new FinishStatement(lrsStatement);
            expect(statement.passed).toBeTruthy();
        });

        it('should set passed to false if statement verb is not passed', () => {
            lrsStatement.verb = constants.reporting.xApiVerbIds.failed;
            statement = new FinishStatement(lrsStatement);
            expect(statement.passed).toBeFalsy();
        });
    });

    describe('[expandLoadAction]', () => {

        it('should return promise', () => {
            expect(statement.expandLoadAction()).toBePromise();
        });

        it('should call xApiProvider.getMasteredStatements with correct args', () => {
            statement.expandLoadAction();
            expect(xApiProvider.getMasteredStatements).toHaveBeenCalledWith(attemptId);
        });

        describe('when xApiProvider.getMasteredStatements call was success', () => {

            it('should call xApiProvider.getStartedStatement with correct args', done => co(function*() {
                yield statement.expandLoadAction();
                expect(xApiProvider.getStartedStatement).toHaveBeenCalledWith(attemptId);
            }).then(done));


            describe('and xApiProvider.getStartedStatement call was sucess', () => {

                it('should fill children collection with ObjectiveStatement instances', done => co(function*() {
                    yield statement.expandLoadAction();
                    expect(statement.children().length).toBe(2);
                    expect(statement.children()[0]).toBeInstanceOf(ObjectiveStatement);
                    expect(statement.children()[1]).toBeInstanceOf(ObjectiveStatement);
                    expect(statement.children()[0].lrsStatement).toBe(masteredStatements[0]);
                    expect(statement.children()[1].lrsStatement).toBe(masteredStatements[1]);
                }).then(done));

                it('should set startedLrsStatement to started statement', done => co(function*() {
                    yield statement.expandLoadAction();
                    expect(statement.startedLrsStatement).toBe(startedStatement[0]);
                }).then(done));

            });
        });
    });
});