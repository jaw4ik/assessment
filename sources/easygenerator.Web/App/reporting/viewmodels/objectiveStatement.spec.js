import ObjectiveStatement from './objectiveStatement';

import QuestionStatement from './questionStatement';
import ExpandableStatement from './expandableStatement';
import XApiProvider from './../xApiProvider';

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
        spyOn(XApiProvider, 'getAnsweredStatements').and.returnValue(answeredDefer.promise);
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

        describe('when answeredStatements is defined', () => {

            describe('and equals null', () => {

                it('should set children to null', () => {
                    statement = new ObjectiveStatement(lrsStatement, null);
                    expect(statement.children).toBeNull();
                });

            });

            describe('and not equals null', () => {

                it('should set children to masteredStatements', () => {
                    var answered = [{ id: 1 }, { id: 2 }];
                    statement = new ObjectiveStatement(lrsStatement, answered);
                    expect(statement.children()).toBe(answered);
                });

            });

        });

    });

    describe('[expandLoadAction]', () => {

        it('should return promise', () => {
            expect(statement.expandLoadAction()).toBePromise();
        });

        it('should call xApiProvider.getAnsweredStatements with correct args', done => (async () => {
            answeredDefer.resolve([]);
            await statement.expandLoadAction();
            expect(XApiProvider.getAnsweredStatements).toHaveBeenCalledWith(attemptId, statementId);
        })().then(done));

        describe('if there are no answered statements', () => {

            beforeEach(() => {
                answeredDefer.resolve([]);
            });

            it('should set children to null', done => (async () => {
                await statement.expandLoadAction();
                expect(statement.children).toBeNull();
            })().then(done));

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

            it('should fill children collection with QuestionStatement instances', done => (async () => {
                await statement.expandLoadAction();
                expect(statement.children().length).toBe(2);
                expect(statement.children()[0]).toBeInstanceOf(QuestionStatement);
                expect(statement.children()[1]).toBeInstanceOf(QuestionStatement);
                expect(statement.children()[0].lrsStatement).toBe(answeredStatements[0]);
                expect(statement.children()[1].lrsStatement).toBe(answeredStatements[1]);
            })().then(done));

        });
    });
});