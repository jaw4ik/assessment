import factory from './questionStatementFactory';

import constants from 'constants';
import ExperiencedStatement from './experiencedStatement';
import AnsweredStatement from './answeredStatement';

describe('reporting [questionStatementFactory]', () => {
    describe('createQuestionStatement:', () => {
        let lrsStatement = {};

        describe('when lrs statement verb is experinced', () => {
            beforeEach(() => {
                lrsStatement.verb = constants.reporting.xApiVerbIds.experienced;
            });

            it('should return experienced statement', () => {
                expect(factory.createQuestionStatement(lrsStatement)).toBeInstanceOf(ExperiencedStatement);
            });
        });

        describe('when lrs statement verb is answered', () => {
            beforeEach(() => {
                lrsStatement.verb = constants.reporting.xApiVerbIds.answered;
            });

            it('should return answered statement', () => {
                expect(factory.createQuestionStatement(lrsStatement)).toBeInstanceOf(AnsweredStatement);
            });
        });

        describe('when lrs statement is none of above', () => {
            beforeEach(() => {
                lrsStatement.verb = 'verbik';
            });

            it('should throw exception', function () {
                var f = function () {
                    factory.createQuestionStatement(lrsStatement);
                };

                expect(f).toThrow('Unexpected question statement verb id');
            });
        });
    });
});