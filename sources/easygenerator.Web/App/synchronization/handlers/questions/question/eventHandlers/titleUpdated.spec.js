import handler from './titleUpdated';

import dataContext from 'dataContext';
import app from 'durandal/app';
import constants from 'constants';

describe('synchronization question [titleUpdated]', function () {

    var questionId = 'id',
        question = { id: questionId },
        title = 'title',
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
                handler(undefined, title, modifiedOn.toISOString());
            };

            expect(f).toThrow('QuestionId is not a string');
        });
    });

    describe('when title is not a string', function () {
        it('should throw an exception', function () {
            var f = function () {
                handler(questionId, undefined, modifiedOn.toISOString());
            };

            expect(f).toThrow('Title is not a string');
        });
    });

    describe('when modifiedOn is not a date', function () {
        it('should throw an exception', function () {
            var f = function () {
                handler(questionId, title, undefined);
            };

            expect(f).toThrow('ModifiedOn is not a string');
        });
    });

    describe('when question is not found in data context', function () {
        beforeEach(function() {
            spyOn(dataContext, 'getQuestions').and.returnValue([]);
        });

        it('should throw an exception', function () {
            var f = function () {
                handler(questionId, title, modifiedOn.toISOString());
            };

            expect(f).toThrow('Question has not been found');
        });
    });

    it('should update question title', function () {
        question.title = '';
        spyOn(dataContext, 'getQuestions').and.returnValue([question]);
        handler(questionId, title, modifiedOn.toISOString());

        expect(question.title).toBe(title);
    });

    it('should update question modified on date', function () {
        question.modifiedOn = '';
        spyOn(dataContext, 'getQuestions').and.returnValue([question]);
        handler(questionId, title, modifiedOn.toISOString());

        expect(question.modifiedOn.toISOString()).toBe(modifiedOn.toISOString());
    });

    it('should trigger app event', function () {
        spyOn(dataContext, 'getQuestions').and.returnValue([question]);
        handler(questionId, title, modifiedOn.toISOString());
        expect(app.trigger).toHaveBeenCalledWith(constants.messages.question.titleUpdatedByCollaborator, question);
    });
});
