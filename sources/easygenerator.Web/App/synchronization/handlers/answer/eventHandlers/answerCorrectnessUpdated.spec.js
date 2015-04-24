define(['synchronization/handlers/answer/eventHandlers/answerCorrectnessUpdated'], function (handler) {
    "use strict";

    var dataContext = require('dataContext'),
        app = require('durandal/app'),
        constants = require('constants')
    ;

    describe('synchronization answer [answerCorrectnessUpdated]', function () {

        var questionId = 'id',
            answerId = 'answerId',
            question = { id: questionId },
            isCorrect = true,
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
                    handler(undefined, answerId, isCorrect, modifiedOn.toISOString());
                };

                expect(f).toThrow('QuestionId is not a string');
            });
        });

        describe('when answerId is not a string', function () {
            it('should throw an exception', function () {
                var f = function () {
                    handler(questionId, undefined, isCorrect, modifiedOn.toISOString());
                };

                expect(f).toThrow('AnswerId is not a string');
            });
        });

        describe('when isCorrect is not boolean', function () {
            it('should throw an exception', function () {
                var f = function () {
                    handler(questionId, answerId, undefined, modifiedOn.toISOString());
                };

                expect(f).toThrow('IsCorrect is not boolean');
            });
        });

        describe('when modifiedOn is not a string', function () {
            it('should throw an exception', function () {
                var f = function () {
                    handler(questionId, answerId, isCorrect, undefined);
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
                    handler(questionId, answerId, isCorrect, modifiedOn.toISOString());
                };

                expect(f).toThrow('Question has not been found');
            });
        });

        it('should update question modified on date', function () {
            question.modifiedOn = '';
            spyOn(dataContext, 'getQuestions').and.returnValue([question]);
            handler(questionId, answerId, isCorrect, modifiedOn.toISOString());

            expect(question.modifiedOn.toISOString()).toBe(modifiedOn.toISOString());
        });

        it('should trigger app event', function () {
            spyOn(dataContext, 'getQuestions').and.returnValue([question]);
            handler(questionId, answerId, isCorrect, modifiedOn.toISOString());
            expect(app.trigger).toHaveBeenCalledWith(constants.messages.question.answer.answerCorrectnessUpdatedByCollaborator, question, answerId, isCorrect);
        });
    });
})