import ProgressedStatement from './progressedStatement';

import ExpandableStatement from './expandableStatement';
import SectionStatement from './sectionStatement';
import XApiProvider from 'reporting/xApiProvider';
import constants from 'constants';
import localizationManager from 'localization/localizationManager';

describe('viewmodel [ProgressedStatement]', () => {
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
        ];

    beforeEach(() => {
        attemptId = 'attemptId';
        statementId = 'statementId';
        lrsStatement = { attemptId: attemptId, id: statementId, score: 50, actor: { name: 'name', email: 'email' } };
        spyOn(XApiProvider, 'getSectionStatements').and.returnValue(Promise.resolve(masteredStatements));
        spyOn(localizationManager, 'localize').and.callFake(function(localizationKey) {
            if (localizationKey === 'reportingInfoNotAvailable') {
                return "N/A";
            }
        });
        statement = new ProgressedStatement(lrsStatement);
    });

    it('should be class', () => {
        expect(ProgressedStatement).toBeFunction();
    });

    describe('[class]', () => {
        it('should extends ExpandableStatement', () => {
            expect(statement).toBeInstanceOf(ExpandableStatement);
        });

        describe('learnerDisplayName:', () => {
            it('should use actors name and email if exist', () => {
                expect(statement.learnerDisplayName).toBe(`${statement.lrsStatement.actor.name} (${statement.lrsStatement.actor.email})`);
            });

            it('should return Not Available texts for name and email if they are not exist', () => {
                var statementWithEmptyActor = new ProgressedStatement({ attemptId: attemptId, id: statementId, score: 50, actor: {} });
                expect(statementWithEmptyActor.learnerDisplayName).toBe('N/A (N/A)');
            });
        });

        it('should set passed to true if statement verb is passed', () => {
            lrsStatement.verb = constants.reporting.xApiVerbIds.passed;
            statement = new ProgressedStatement(lrsStatement);
            expect(statement.passed).toBeTruthy();
        });

        it('should set passed to false if statement verb is not passed', () => {
            lrsStatement.verb = constants.reporting.xApiVerbIds.failed;
            statement = new ProgressedStatement(lrsStatement);
            expect(statement.passed).toBeFalsy();
        });

        it('should set startedLrsStatement', () => {
            var started = { id: 1 };
            statement = new ProgressedStatement(lrsStatement, started);
            expect(statement.startedLrsStatement).toBe(started);
        });

        describe('when masteredStatements is defined', () => {

            describe('and equals null', () => {

                it('should set children to null', () => {
                    var started = { id: 1 };
                    statement = new ProgressedStatement(lrsStatement, started, null);
                    expect(statement.children).toBeNull();
                });
                
            });

            describe('and not equals null', () => {

                it('should set children to masteredStatements', () => {
                    var started = { id: 1 };
                    var mastered = [{ id: 1 }, { id: 2 }];
                    statement = new ProgressedStatement(lrsStatement, started, mastered);
                    expect(statement.children()).toBe(mastered);
                });
                
            });

        });
    });

    describe('[expandLoadAction]', () => {

        it('should return promise', () => {
            expect(statement.expandLoadAction()).toBePromise();
        });

        it('should call XApiProvider.getSectionStatements with correct args', () => {
            statement.expandLoadAction();
            expect(XApiProvider.getSectionStatements).toHaveBeenCalledWith(attemptId);
        });

        describe('when XApiProvider.getSectionStatements call was success', () => {

            it('should fill children collection with SectionStatement instances', done => (async () => {
                await statement.expandLoadAction();
                expect(statement.children().length).toBe(2);
                expect(statement.children()[0]).toBeInstanceOf(SectionStatement);
                expect(statement.children()[1]).toBeInstanceOf(SectionStatement);
                expect(statement.children()[0].lrsStatement).toBe(masteredStatements[0]);
                expect(statement.children()[1].lrsStatement).toBe(masteredStatements[1]);
            })().then(done));

        });
    });
});