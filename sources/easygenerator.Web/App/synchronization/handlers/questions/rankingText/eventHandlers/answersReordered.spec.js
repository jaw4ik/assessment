import handler from './answersReordered';
import dataContext from 'dataContext';
import app from 'durandal/app';
import constants from 'constants';

describe('synchronization rankingText [answersReordered]', () => {

    var questionId = 'questionId',
        question = { id: questionId },
        answerIds = [],
        modifiedOn = new Date();

    beforeEach(() => {
        spyOn(app, 'trigger');
    });

    describe('when questionId is not a string', () => {
        it('should throw an exception', () => {
            var f = () => {
                handler(undefined, answerIds, modifiedOn.toISOString());
            };

            expect(f).toThrow('QuestionId is not a string');
        });
    });

    describe('when answerIds is not an array', () => {
        it('should throw an exception', () => {
            var f = () => {
                handler(questionId, undefined, modifiedOn.toISOString());
            };

            expect(f).toThrow('AnswerIds is not an array');
        });
    });

    describe('when modifiedOn is not a date', () => {
        it('should throw an exception', () => {
            var f = () => {
                handler(questionId, answerIds, undefined);
            };

            expect(f).toThrow('ModifiedOn is not a string');
        });
    });

    describe('when question is not found in data context', () => {
        beforeEach(() => {
            spyOn(dataContext, 'getQuestions').and.returnValue([]);
        });

        it('should throw an exception', () => {
            var f = () => {
                handler(questionId, answerIds, modifiedOn.toISOString());
            };

            expect(f).toThrow('Question has not been found');
        });
    });

    it('should update question modified on date', () => {
        question.modifiedOn = '';
        spyOn(dataContext, 'getQuestions').and.returnValue([question]);
        handler(questionId, answerIds, modifiedOn.toISOString());
        expect(question.modifiedOn.toISOString()).toBe(modifiedOn.toISOString());
    });

    it('should trigger app event', () => {
        spyOn(dataContext, 'getQuestions').and.returnValue([question]);
        handler(questionId, answerIds, modifiedOn.toISOString());
        expect(app.trigger).toHaveBeenCalled();
        expect(app.trigger.calls.mostRecent().args[0]).toBe(constants.messages.question.rankingText.answersReorderedByCollaborator);
        expect(app.trigger.calls.mostRecent().args[1]).toBe(questionId);
        expect(app.trigger.calls.mostRecent().args[2]).toBe(answerIds);
    });
});