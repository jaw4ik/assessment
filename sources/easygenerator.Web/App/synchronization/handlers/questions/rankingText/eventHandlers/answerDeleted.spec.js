import handler from './answerDeleted';
import dataContext from 'dataContext';
import app from 'durandal/app';
import constants from 'constants';

describe('synchronization rankingText [answerDeleted]', () => {

    var questionId = 'questionId',
        answerId = 'answerId',
        question = { id: questionId },
        modifiedOn = new Date();

    beforeEach(() => {
        spyOn(app, 'trigger');
    });

    describe('when questionId is not a string', () => {
        it('should throw an exception', () => {
            var f = () => {
                handler(undefined, answerId, modifiedOn.toISOString());
            };

            expect(f).toThrow('QuestionId is not a string');
        });
    });

    describe('when answerId is not a string', () => {
        it('should throw an exception', () => {
            var f = () => {
                handler(questionId, undefined, modifiedOn.toISOString());
            };

            expect(f).toThrow('AnswerId is not a string');
        });
    });

    describe('when modifiedOn is not a date', () => {
        it('should throw an exception', () => {
            var f = () => {
                handler(questionId, answerId, undefined);
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
                handler(questionId, answerId, modifiedOn.toISOString());
            };

            expect(f).toThrow('Question has not been found');
        });
    });

    it('should update question modified on date', () => {
        question.modifiedOn = '';
        spyOn(dataContext, 'getQuestions').and.returnValue([question]);
        handler(questionId, answerId, modifiedOn.toISOString());
        expect(question.modifiedOn.toISOString()).toBe(modifiedOn.toISOString());
    });

    it('should trigger app event', () => {
        spyOn(dataContext, 'getQuestions').and.returnValue([question]);
        handler(questionId, answerId, modifiedOn.toISOString());
        expect(app.trigger).toHaveBeenCalled();
        expect(app.trigger.calls.mostRecent().args[0]).toBe(constants.messages.question.rankingText.answerDeletedByCollaborator);
        expect(app.trigger.calls.mostRecent().args[1]).toBe(questionId);
        expect(app.trigger.calls.mostRecent().args[2]).toBe(answerId);
    });
});