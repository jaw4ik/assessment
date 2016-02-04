import handler from './answerCreated';
import dataContext from 'dataContext';
import app from 'durandal/app';
import constants from 'constants';


describe('synchronization rankingText [answerCreated]', () => {

    var questionId = 'questionId',
        answer = { Id: 'answerId', Text: 'some text' },
        question = { id: questionId },
        modifiedOn = new Date();

    beforeEach(() => {
        spyOn(app, 'trigger');
    });

    describe('when questionId is not a string', () => {
        it('should throw an exception', () => {
            var f = () => {
                handler(undefined, answer, modifiedOn.toISOString());
            };

            expect(f).toThrow('QuestionId is not a string');
        });
    });

    describe('when answer is not an object', () => {
        it('should throw an exception', () => {
            var f = () => {
                handler(questionId, undefined, modifiedOn.toISOString());
            };

            expect(f).toThrow('Answer is not an object');
        });
    });

    describe('when modifiedOn is not a date', () => {
        it('should throw an exception', () => {
            var f = () => {
                handler(questionId, answer, undefined);
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
                handler(questionId, answer, modifiedOn.toISOString());
            };

            expect(f).toThrow('Question has not been found');
        });
    });

    it('should update question modified on date', () => {
        question.modifiedOn = '';
        spyOn(dataContext, 'getQuestions').and.returnValue([question]);
        handler(questionId, answer, modifiedOn.toISOString());
        expect(question.modifiedOn.toISOString()).toBe(modifiedOn.toISOString());
    });

    it('should trigger app event', () => {
        spyOn(dataContext, 'getQuestions').and.returnValue([question]);
        handler(questionId, answer, modifiedOn.toISOString());
        expect(app.trigger).toHaveBeenCalled();
        expect(app.trigger.calls.mostRecent().args[0]).toBe(constants.messages.question.rankingText.answerCreatedByCollaborator);
        expect(app.trigger.calls.mostRecent().args[1]).toBe(questionId);
        expect(app.trigger.calls.mostRecent().args[2]).toBe(answer.Id);
        expect(app.trigger.calls.mostRecent().args[3]).toBe(answer.Text);
    });
});