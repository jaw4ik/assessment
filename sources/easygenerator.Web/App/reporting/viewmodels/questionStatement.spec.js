import QuestionStatement from './questionStatement';

import ExpandableStatement from './expandableStatement';

describe('viewmodel [QuestionStatement]', () => {

    it('should be class', () => {
        expect(QuestionStatement).toBeFunction();
    });

    describe('[class]', () => {
        var lrsStatement,
            statement;

        beforeEach(() => {
            lrsStatement = {
                score: 50
            };
            statement = new QuestionStatement(lrsStatement);
        });

        it('should extends ExpandableStatement', () => {
            expect(statement).toBeInstanceOf(ExpandableStatement);
        });

        it('should set isExpandable to false', () => {
            lrsStatement.attemptId = 'attemptId';
            statement = new QuestionStatement(lrsStatement);
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
                statement = new QuestionStatement(lrsStatement);
                expect(statement.correct).toBeTruthy();
            });
        });

        describe('when lrsStatement.score does not equal to 100', () => {
            it('should set correct prop to false', () => {
                expect(statement.correct).toBeFalsy();
            });
        });

        describe('[show answer]', () => {
            it('should set answerShown to true', () => {
                statement.answerShown(false);
                statement.showAnswer();
                expect(statement.answerShown()).toBeTruthy();
            });
        });

        describe('[hide answer]', () => {
            it('should set answerShown to false', () => {
                statement.answerShown(true);
                statement.hideAnswer();
                expect(statement.answerShown()).toBeFalsy();
            });
        });

    });
});