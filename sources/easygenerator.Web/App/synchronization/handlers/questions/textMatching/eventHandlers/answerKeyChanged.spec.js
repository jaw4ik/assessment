define(['synchronization/handlers/questions/textMatching/eventHandlers/answerKeyChanged'], function (handler) {
    "use strict";

    var
        dataContext = require('dataContext'),
        app = require('durandal/app'),
        constants = require('constants')
    ;

    describe('synchronization textMatching [answerKeyChanged]', function () {

        var questionId = 'questionId',
            answer = { Id: 'answerId', Key: 'some key' },
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
            expect(app.trigger).toHaveBeenCalled();
            expect(app.trigger.calls.mostRecent().args[0]).toBe(constants.messages.question.textMatching.answerKeyChangedByCollaborator);
        });
    });
})