import ExperiencedStatement from './experiencedStatement';

import QuestionStatementBase from './questionStatementBase';

describe('viewmodel [ExperiencedStatement]', () => {

    it('should be class', () => {
        expect(ExperiencedStatement).toBeFunction();
    });

    describe('[class]', () => {
        var lrsStatement,
            statement;

        beforeEach(() => {
            lrsStatement = {
                score: 50
            };
            statement = new ExperiencedStatement(lrsStatement);
        });

        it('should extends ExpandableStatement', () => {
            expect(statement).toBeInstanceOf(QuestionStatementBase);
        });

        it('should set isExpandable to false', () => {
            lrsStatement.attemptId = 'attemptId';
            statement = new ExperiencedStatement(lrsStatement);
            expect(statement.isExpandable).toBeFalsy();
        });

        it('should set isExpanded to null', () => {
            expect(statement.isExpanded).toBeNull();
        });

        it('should set children to null', () => {
            expect(statement.children).toBeNull();
        });

        describe('when lrsStatement.score is 100', () => {
            it('should set correct prop to true', () => {
                lrsStatement.score = 100;
                statement = new ExperiencedStatement(lrsStatement);
                expect(statement.correct).toBeTruthy();
            });
        });

        describe('when lrsStatement.score does not equal to 100', () => {
            it('should set correct prop to false', () => {
                expect(statement.correct).toBeFalsy();
            });
        });
    });
});