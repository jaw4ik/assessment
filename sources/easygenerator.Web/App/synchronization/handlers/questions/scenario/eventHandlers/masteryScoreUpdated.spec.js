import handler from './masteryScoreUpdated';

import dataContext from 'dataContext';
import app from 'durandal/app';
import constants from 'constants';

describe('synchronization scenario [masteryScoreUpdated]', function () {

    var questionId = 'questionId',
        masteryScore = 50,
        question = { id: questionId },
        modifiedOn = new Date();

    beforeEach(function () {
        spyOn(app, 'trigger');
    });

    it('should be function', function () {
        expect(handler).toBeFunction();
    });

    describe('when questionId is not a string', function () {
        it('should throw an exception', function () {
            var f = function () {
                handler(undefined, masteryScore, modifiedOn.toISOString());
            };

            expect(f).toThrow('QuestionId is not a string');
        });
    });

    describe('when masteryScore is not a string', function () {
        it('should throw an exception', function () {
            var f = function () {
                handler(questionId, undefined, modifiedOn.toISOString());
            };

            expect(f).toThrow('MasteryScore is not a number');
        });
    });

    describe('when modifiedOn is not a date', function () {
        it('should throw an exception', function () {
            var f = function () {
                handler(questionId, masteryScore, undefined);
            };

            expect(f).toThrow('ModifiedOn is not a string');
        });
    });

    describe('when question is not found in data context', function () {
        beforeEach(function () {
            spyOn(dataContext, 'getQuestions').and.returnValue([]);
        });

        it('should throw an exception', function () {
            var f = function () {
                handler(questionId, masteryScore, modifiedOn.toISOString());
            };

            expect(f).toThrow('Question has not been found');
        });
    });

    it('should update question modified on date', function () {
        question.modifiedOn = '';
        spyOn(dataContext, 'getQuestions').and.returnValue([question]);
        handler(questionId, masteryScore, modifiedOn.toISOString());
        expect(question.modifiedOn.toISOString()).toBe(modifiedOn.toISOString());
    });

    it('should trigger app event', function () {
        spyOn(dataContext, 'getQuestions').and.returnValue([question]);
        handler(questionId, masteryScore, modifiedOn.toISOString());
        expect(app.trigger).toHaveBeenCalledWith(constants.messages.question.scenario.masteryScoreUpdated, questionId, masteryScore);
    });
});
