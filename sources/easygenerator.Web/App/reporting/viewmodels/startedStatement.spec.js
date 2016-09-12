import StartedStatement from './startedStatement';

import ExpandableStatement from './expandableStatement';
import localizationManager from 'localization/localizationManager';

describe('viewmodel [StartedStatement]', () => {
    var lrsStatement,
        lrsStatementWithAccount,
	    statement,
        statementWithAccount,
	    attemptId,
		statementId;

    beforeEach(() => {
        attemptId = 'attemptId';
        statementId = 'statementId';
        lrsStatement = { attemptId: attemptId, id: statementId, score: null, actor: { name: 'name', email: 'email' } };
        lrsStatementWithAccount = { attemptId: attemptId, id: statementId, score: null, actor: { name: 'name', account: { homePage: 'http://someLRS.com', name: '12345' } } };
        statement = new StartedStatement(lrsStatement);
        statementWithAccount = new StartedStatement(lrsStatementWithAccount);
        spyOn(localizationManager, 'localize').and.callFake(function(localizationKey) {
            if (localizationKey === 'reportingInfoNotAvailable') {
                return "N/A";
            }
        });
    });

    it('should be class', () => {
        expect(StartedStatement).toBeFunction();
    });

    describe('[class]', () => {
        it('should extends ExpandableStatement', () => {
            expect(statement).toBeInstanceOf(ExpandableStatement);
        });
        
        describe('learnerDisplayName:', () => {
            it('should use actors name and email if exist', () => {
                expect(statement.learnerDisplayName).toBe(`${statement.lrsStatement.actor.name} (${statement.lrsStatement.actor.email})`);
            });

            it('should user actors name and account name if account exists', () => {
                expect(statementWithAccount.learnerDisplayName).toBe(`${statementWithAccount.lrsStatement.actor.name} (${statementWithAccount.lrsStatement.actor.account.name})`);
            });

            it('should return Not Available texts for name and email if they are not exist', () => {
                var statementWithEmptyActor = new StartedStatement({ attemptId: attemptId, id: statementId, score: 50, actor: {} });
                expect(statementWithEmptyActor.learnerDisplayName).toBe('N/A (N/A)');
            });
        });

        describe('learnerAccountHomePage:', () => {
            
            describe('when actor\'s account is not provided', () => {
                it('should be not defined', () => {
                    expect(statement.learnerAccountHomePage).not.toBeDefined();
                });
            });

            describe('when actor\'s account is provided', () => {
                it('should be defined', () => {
                    expect(statementWithAccount.learnerAccountHomePage).toBe(statementWithAccount.lrsStatement.actor.account.homePage);
                });
            });

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