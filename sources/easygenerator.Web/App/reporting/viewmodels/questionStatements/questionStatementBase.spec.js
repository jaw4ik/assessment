import QuestionStatementBase from './questionStatementBase';

import ExpandableStatement from './../expandableStatement';

describe('viewmodel [QuestionStatementBase]', () => {

    it('should be class', () => {
        expect(QuestionStatementBase).toBeFunction();
    });

    describe('[class]', () => {
        var lrsStatement,
            statement;

        beforeEach(() => {
            lrsStatement = {
                score: 50
            };
            statement = new QuestionStatementBase(lrsStatement);
        });

        it('should extends ExpandableStatement', () => {
            expect(statement).toBeInstanceOf(ExpandableStatement);
        });

        it('should set isExpandable to false', () => {
            lrsStatement.attemptId = 'attemptId';
            statement = new QuestionStatementBase(lrsStatement);
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
                statement = new QuestionStatementBase(lrsStatement);
                expect(statement.correct).toBeTruthy();
            });
        });

        describe('when lrsStatement.score does not equal to 100', () => {
            it('should set correct prop to false', () => {
                expect(statement.correct).toBeFalsy();
            });
        });

        describe('when statement has property [questionType]', () => {

            it('should create property [questionType]', () => {
                lrsStatement.questionType = 'some';
                statement = new QuestionStatementBase(lrsStatement);
                expect(statement.questionType).toBe('some');
            });

        });

        describe('when statement has property [isSurvey]', () => {

            it('should create property [isSurvey]', () => {
                lrsStatement.isSurvey = true;
                statement = new QuestionStatementBase(lrsStatement);
                expect(statement.isSurvey).toBeTruthy();
            });

        });
    });
});