import handler from './answerCreated';

import dataContext from 'dataContext';
import app from 'durandal/app';
import constants from 'constants';
import mapper from 'mappers/singleSelectImageAnswerMapper';

describe('synchronization singleSelectImage [answerCreated]', function () {

    var questionId = 'questionId',
        answer = { Id: 'answerId', Image: 'img' },
        answerModel = { id: 'id' },
        question = { id: questionId },
        modifiedOn = new Date();

    beforeEach(function () {
        spyOn(app, 'trigger');
        spyOn(mapper, 'map').and.returnValue(answerModel);
    });

    it('should be function', function () {
        expect(handler).toBeFunction();
    });

    describe('when questionId is not a string', function () {
        it('should throw an exception', function () {
            var f = function () {
                handler(undefined, answer, modifiedOn.toISOString());
            };

            expect(f).toThrow('QuestionId is not a string');
        });
    });

    describe('when answer is not an object', function () {
        it('should throw an exception', function () {
            var f = function () {
                handler(questionId, undefined, modifiedOn.toISOString());
            };

            expect(f).toThrow('Answer is not an object');
        });
    });

    describe('when modifiedOn is not a date', function () {
        it('should throw an exception', function () {
            var f = function () {
                handler(questionId, answer, undefined);
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
                handler(questionId, answer, modifiedOn.toISOString());
            };

            expect(f).toThrow('Question has not been found');
        });
    });

    it('should update question modified on date', function () {
        question.modifiedOn = '';
        spyOn(dataContext, 'getQuestions').and.returnValue([question]);
        handler(questionId, answer, modifiedOn.toISOString());
        expect(question.modifiedOn.toISOString()).toBe(modifiedOn.toISOString());
    });

    it('should trigger app event', function () {
        spyOn(dataContext, 'getQuestions').and.returnValue([question]);
        handler(questionId, answer, modifiedOn.toISOString());
        expect(app.trigger).toHaveBeenCalledWith(constants.messages.question.singleSelectImage.answerCreatedByCollaborator, questionId, answerModel);
    });
});
