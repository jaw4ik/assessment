import co from 'co';
import ObjectiveStatement from 'reporting/viewmodels/objectiveStatement';
import QuestionStatement from 'reporting/viewmodels/questionStatement';
import ExpandableStatement from 'reporting/viewmodels/expandableStatement';
import xApiProvider from 'reporting/xApiProvider';

describe('viewmodel [ObjectiveStatement]', () => {
    var lrsStatement,
        statement,
        attemptId,
        statementId,
        answeredDefer;

    beforeEach(() => {
        attemptId = 'attemptId';
        answeredDefer = Q.defer();
        statementId = 'statementId';
        lrsStatement = { attemptId: attemptId, id: statementId, score: 50 };
        spyOn(xApiProvider, 'getAnsweredStatements').and.returnValue(answeredDefer.promise);
        statement = new ObjectiveStatement(lrsStatement);
    });

    it('should be class', () => {
        expect(ObjectiveStatement).toBeFunction();
    });

    describe('[class]', () => {
        it('should extends ExpandableStatement', () => {
            expect(statement).toBeInstanceOf(ExpandableStatement);
        });

        it('should set hasScore to true if lrsStatement.score is not null', () => {
            expect(statement.hasScore).toBeTruthy();
        });

        it('should set hasScore to false if lrsStatement.score is null', () => {
            lrsStatement.score = null;
            statement = new ObjectiveStatement(lrsStatement);
            expect(statement.hasScore).toBeFalsy();
        });
    });

    describe('[expandLoadAction]', () => {

        it('should return promise', () => {
            expect(statement.expandLoadAction()).toBePromise();
        });

        it('should call xApiProvider.getAnsweredStatements with correct args', done => co(function*() {
            answeredDefer.resolve([]);
            yield statement.expandLoadAction();
            expect(xApiProvider.getAnsweredStatements).toHaveBeenCalledWith(attemptId, statementId);
        }).then(() => done()));

        describe('if there are no answered statements', () => {

            beforeEach(() => {
                answeredDefer.resolve([]);
            });

            it('should set children to null', done => co(function*() {
                yield statement.expandLoadAction();
                expect(statement.children).toBeNull();
            }).then(() => done()));

        });

        describe('when answered statements were returned', () => {

            var answeredStatements;
            beforeEach(() => {
                answeredStatements = [
				{
					score: 50
				}, {
					score: 100
				}];
                answeredDefer.resolve(answeredStatements);
            });

            it('should fill children collection with QuestionStatement instances', done => co(function*() {
                yield statement.expandLoadAction();
                expect(statement.children().length).toBe(2);
                expect(statement.children()[0]).toBeInstanceOf(QuestionStatement);
                expect(statement.children()[1]).toBeInstanceOf(QuestionStatement);
                expect(statement.children()[0].lrsStatement).toBe(answeredStatements[0]);
                expect(statement.children()[1].lrsStatement).toBe(answeredStatements[1]);
            }).then(() => done()));

        });
    });
});