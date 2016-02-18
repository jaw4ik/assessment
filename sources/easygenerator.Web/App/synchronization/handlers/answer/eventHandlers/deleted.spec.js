import handler from './deleted';

import dataContext from 'dataContext';
import app from 'durandal/app';
import constants from 'constants';

describe('synchronization answer [deleted]', function () {

    var questionId = 'id',
        answerId = 'answerId',
        question = { id: questionId, type: constants.questionType.multipleSelect.type },
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
                handler(undefined, answerId, modifiedOn.toISOString());
            };

            expect(f).toThrow('QuestionId is not a string');
        });
    });

    describe('when answer is not an object', function () {
        it('should throw an exception', function () {
            var f = function () {
                handler(questionId, undefined, modifiedOn.toISOString());
            };

            expect(f).toThrow('AnswerId is not a string');
        });
    });

    describe('when modifiedOn is not a string', function () {
        it('should throw an exception', function () {
            var f = function () {
                handler(questionId, answerId, undefined);
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
                handler(questionId, answerId, modifiedOn.toISOString());
            };

            expect(f).toThrow('Question has not been found');
        });
    });

    it('should update question modified on date', function () {
        question.modifiedOn = '';
        spyOn(dataContext, 'getQuestions').and.returnValue([question]);
        handler(questionId, answerId, modifiedOn.toISOString());

        expect(question.modifiedOn.toISOString()).toBe(modifiedOn.toISOString());
    });

    describe('when question type is multipleselect', function() {
        
        it('should trigger app event', function () {
            spyOn(dataContext, 'getQuestions').and.returnValue([question]);
            handler(questionId, answerId, modifiedOn.toISOString());
            expect(app.trigger).toHaveBeenCalledWith(constants.messages.question.answer.deletedByCollaborator, question, answerId);
        });

    });

    describe('when question type is singleSelectText', function () {

        it('should trigger app event', function () {
            question.type = constants.questionType.singleSelectText.type;
            spyOn(dataContext, 'getQuestions').and.returnValue([question]);
            handler(questionId, answerId, modifiedOn.toISOString());
            expect(app.trigger).toHaveBeenCalledWith(constants.messages.question.answer.singleSelectTextDeleteByCollaborator, question, answerId);
        });

    });
        
});
