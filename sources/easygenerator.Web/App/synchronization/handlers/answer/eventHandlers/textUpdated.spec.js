define(['synchronization/handlers/answer/eventHandlers/textUpdated'], function (handler) {
    "use strict";

    var dataContext = require('dataContext'),
        app = require('durandal/app'),
        constants = require('constants')
    ;

    describe('synchronization answer [textUpdated]', function () {

        var questionId = 'id',
            answerId = 'answerId',
            question = { id: questionId },
            text = 'text',
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
                    handler(undefined, answerId, text, modifiedOn.toISOString());
                };

                expect(f).toThrow('QuestionId is not a string');
            });
        });

        describe('when answerId is not a string', function () {
            it('should throw an exception', function () {
                var f = function () {
                    handler(questionId, undefined, text, modifiedOn.toISOString());
                };

                expect(f).toThrow('AnswerId is not a string');
            });
        });

        describe('when text is not a string', function () {
            it('should throw an exception', function () {
                var f = function () {
                    handler(questionId, answerId, undefined, modifiedOn.toISOString());
                };

                expect(f).toThrow('Text is not a string');
            });
        });

        describe('when modifiedOn is not a string', function () {
            it('should throw an exception', function () {
                var f = function () {
                    handler(questionId, answerId, text, undefined);
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
                    handler(questionId, answerId, text, modifiedOn.toISOString());
                };

                expect(f).toThrow('Question has not been found');
            });
        });

        it('should update question modified on date', function () {
            question.modifiedOn = '';
            spyOn(dataContext, 'getQuestions').and.returnValue([question]);
            handler(questionId, answerId, text, modifiedOn.toISOString());

            expect(question.modifiedOn.toISOString()).toBe(modifiedOn.toISOString());
        });

        it('should trigger app event', function () {
            spyOn(dataContext, 'getQuestions').and.returnValue([question]);
            handler(questionId, answerId, text, modifiedOn.toISOString());
            expect(app.trigger).toHaveBeenCalledWith(constants.messages.question.answer.textUpdatedByCollaborator, question, answerId, text);
        });
    });
})