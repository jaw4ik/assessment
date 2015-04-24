define(['synchronization/handlers/answer/eventHandlers/created'], function (handler) {
    "use strict";

    var dataContext = require('dataContext'),
        app = require('durandal/app'),
        constants = require('constants'),
        answerMapper = require('mappers/answerModelMapper')
    ;

    describe('synchronization answer [created]', function () {

        var questionId = 'id',
            question = { id: questionId },
            modifiedOn = new Date(),
            answer = {},
            answerData = { createdOn: modifiedOn.toISOString() };

        beforeEach(function () {
            spyOn(app, 'trigger');
            spyOn(answerMapper, 'map').and.returnValue(answer);
        });

        it('should be function', function () {
            expect(handler).toBeFunction();
        });

        describe('when questionId is not a string', function () {
            it('should throw an exception', function () {
                var f = function () {
                    handler(undefined, answerData);
                };

                expect(f).toThrow('QuestionId is not a string');
            });
        });

        describe('when answer is not an object', function () {
            it('should throw an exception', function () {
                var f = function () {
                    handler(questionId, undefined);
                };

                expect(f).toThrow('Answer is not an object');
            });
        });

        describe('when question is not found in data context', function () {
            beforeEach(function () {
                spyOn(dataContext, 'getQuestions').and.returnValue([]);
            });

            it('should throw an exception', function () {
                var f = function () {
                    handler(questionId, answerData);
                };

                expect(f).toThrow('Question has not been found');
            });
        });

        it('should update question modified on date', function () {
            question.modifiedOn = '';
            spyOn(dataContext, 'getQuestions').and.returnValue([question]);
            handler(questionId, answerData);

            expect(question.modifiedOn.toISOString()).toBe(answerData.createdOn);
        });

        it('should trigger app event', function () {
            spyOn(dataContext, 'getQuestions').and.returnValue([question]);
            handler(questionId, answerData);
            expect(app.trigger).toHaveBeenCalledWith(constants.messages.question.answer.addedByCollaborator, question, answer);
        });
    });
})