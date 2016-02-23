import handler from './contentUpdated';

import dataContext from 'dataContext';
import app from 'durandal/app';
import constants from 'constants';

describe('synchronization question [contentUpdated]', function () {

    var questionId = 'id',
        question = { id: questionId },
        content = 'content',
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
                handler(undefined, content, modifiedOn.toISOString());
            };

            expect(f).toThrow('QuestionId is not a string');
        });
    });

    describe('when modifiedOn is not a date', function () {
        it('should throw an exception', function () {
            var f = function () {
                handler(questionId, content, undefined);
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
                handler(questionId, content, modifiedOn.toISOString());
            };

            expect(f).toThrow('Question has not been found');
        });
    });

    it('should update question content', function () {
        question.content = '';
        spyOn(dataContext, 'getQuestions').and.returnValue([question]);
        handler(questionId, content, modifiedOn.toISOString());

        expect(question.content).toBe(content);
    });

    it('should update question modified on date', function () {
        question.modifiedOn = '';
        spyOn(dataContext, 'getQuestions').and.returnValue([question]);
        handler(questionId, content, modifiedOn.toISOString());

        expect(question.modifiedOn.toISOString()).toBe(modifiedOn.toISOString());
    });

    it('should trigger app event', function () {
        spyOn(dataContext, 'getQuestions').and.returnValue([question]);
        handler(questionId, content, modifiedOn.toISOString());
        expect(app.trigger).toHaveBeenCalledWith(constants.messages.question.contentUpdatedByCollaborator, question);
    });
});
