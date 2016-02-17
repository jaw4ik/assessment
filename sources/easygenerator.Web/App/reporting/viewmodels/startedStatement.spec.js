import StartedStatement from './startedStatement';

import ExpandableStatement from './expandableStatement';
import localizationManager from 'localization/localizationManager';

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

            it('should return Not Available texts for name and email if they are not exist', () => {
                var statementWithEmptyActor = new StartedStatement({ attemptId: attemptId, id: statementId, score: 50, actor: {} });
                expect(statementWithEmptyActor.learnerDisplayName).toBe('N/A (N/A)');
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