define(['synchronization/handlers/questions/singleSelectImage/eventHandlers/answerDeleted'], function (handler) {
    "use strict";

    var
        dataContext = require('dataContext'),
        app = require('durandal/app'),
        constants = require('constants')
    ;

    describe('synchronization singleSelectImage [answerDeleted]', function () {

        var questionId = 'questionId',
            answerId = 'answerId',
            correctAnswerId = 'correctAnswerId',
            question = { id: questionId },
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
                    handler(undefined, answerId, correctAnswerId, modifiedOn.toISOString());
                };

                expect(f).toThrow('QuestionId is not a string');
            });
        });

        describe('when answerId is not an object', function () {
            it('should throw an exception', function () {
                var f = function () {
                    handler(questionId, undefined, correctAnswerId, modifiedOn.toISOString());
                };

                expect(f).toThrow('AnswerId is not a string');
            });
        });

        describe('when correctAnswerId is not an object', function () {
            it('should throw an exception', function () {
                var f = function () {
                    handler(questionId, answerId, undefined, modifiedOn.toISOString());
                };

                expect(f).toThrow('CorrectAnswerId is not a string');
            });
        });

        describe('when modifiedOn is not a date', function () {
            it('should throw an exception', function () {
                var f = function () {
                    handler(questionId, answerId, correctAnswerId, undefined);
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
                    handler(questionId, answerId, correctAnswerId, modifiedOn.toISOString());
                };

                expect(f).toThrow('Question has not been found');
            });
        });

        it('should update question modified on date', function () {
            question.modifiedOn = '';
            spyOn(dataContext, 'getQuestions').and.returnValue([question]);
            handler(questionId, answerId, correctAnswerId, modifiedOn.toISOString());
            expect(question.modifiedOn.toISOString()).toBe(modifiedOn.toISOString());
        });

        it('should trigger app event', function () {
            spyOn(dataContext, 'getQuestions').and.returnValue([question]);
            handler(questionId, answerId, correctAnswerId, modifiedOn.toISOString());
            expect(app.trigger).toHaveBeenCalledWith(constants.messages.question.singleSelectImage.answerDeletedByCollaborator, questionId, answerId, correctAnswerId);
        });
    });
})