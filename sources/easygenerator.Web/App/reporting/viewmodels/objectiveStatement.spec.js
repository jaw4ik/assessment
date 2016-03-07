﻿import ObjectiveStatement from './objectiveStatement';

import questionStatementFactory from 'reporting/viewmodels/questionStatements/questionStatementFactory';
import AnsweredStatement from 'reporting/viewmodels/questionStatements/answeredStatement';
import ExpandableStatement from './expandableStatement';
import XApiProvider from './../xApiProvider';

describe('viewmodel [ObjectiveStatement]', () => {
    var lrsStatement,
        statement,
        attemptId,
        statementId,
        statementsDefer;

    beforeEach(() => {
        attemptId = 'attemptId';
        statementsDefer = Q.defer();
        statementId = 'statementId';
        lrsStatement = { attemptId: attemptId, id: statementId, score: 50 };
        spyOn(XApiProvider, 'getObjectiveStatements').and.returnValue(statementsDefer.promise);
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

        describe('when child statements is defined', () => {

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

        it('should call xApiProvider.getObjectiveStatements with correct args', done => (async () => {
            statementsDefer.resolve([]);
            await statement.expandLoadAction();
            expect(XApiProvider.getObjectiveStatements).toHaveBeenCalledWith(attemptId, statementId);
        })().then(done));

        describe('if there are no answered statements', () => {

            beforeEach(() => {
                statementsDefer.resolve([]);
            });

            it('should set children to null', done => (async () => {
                await statement.expandLoadAction();
                expect(statement.children).toBeNull();
            })().then(done));

        });

        describe('when question statements were returned', () => {

            var questionStatements;
            beforeEach(() => {
                questionStatements = [
				{
				    score: 50
				}, {
				    score: 100
				}];
                statementsDefer.resolve(questionStatements);

                spyOn(questionStatementFactory, 'createQuestionStatement').and.callFake(function (statement) {
                    return new AnsweredStatement(statement);
                });
            });

            it('should fill children collection with QuestionStatement instances', done => (async () => {
                await statement.expandLoadAction();
                expect(statement.children().length).toBe(2);
                expect(statement.children()[0]).toBeInstanceOf(AnsweredStatement);
                expect(statement.children()[1]).toBeInstanceOf(AnsweredStatement);
                expect(statement.children()[0].lrsStatement).toBe(questionStatements[0]);
                expect(statement.children()[1].lrsStatement).toBe(questionStatements[1]);
            })().then(done));

        });
    });
});