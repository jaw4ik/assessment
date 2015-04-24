define(['synchronization/handlers/questions/dragAndDropText/eventHandlers/dropspotPositionChanged'], function (handler) {
    "use strict";

    var
        dataContext = require('dataContext'),
        app = require('durandal/app'),
        constants = require('constants')
    ;

    describe('synchronization dragAndDropText [dropspotPositionChanged]', function () {

        var questionId = 'questionId',
            dropspot = { Id: 'dropspotId', Text: 'some text' },
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
                    handler(undefined, dropspot, modifiedOn.toISOString());
                };

                expect(f).toThrow('QuestionId is not a string');
            });
        });

        describe('when dropspot is not an object', function () {
            it('should throw an exception', function () {
                var f = function () {
                    handler(questionId, undefined, modifiedOn.toISOString());
                };

                expect(f).toThrow('Dropspot is not an object');
            });
        });

        describe('when modifiedOn is not a date', function () {
            it('should throw an exception', function () {
                var f = function () {
                    handler(questionId, dropspot, undefined);
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
                    handler(questionId, dropspot, modifiedOn.toISOString());
                };

                expect(f).toThrow('Question has not been found');
            });
        });

        it('should update question modified on date', function () {
            question.modifiedOn = '';
            spyOn(dataContext, 'getQuestions').and.returnValue([question]);
            handler(questionId, dropspot, modifiedOn.toISOString());
            expect(question.modifiedOn.toISOString()).toBe(modifiedOn.toISOString());
        });

        it('should trigger app event', function () {
            spyOn(dataContext, 'getQuestions').and.returnValue([question]);
            handler(questionId, dropspot, modifiedOn.toISOString());
            expect(app.trigger).toHaveBeenCalled();
            expect(app.trigger.calls.mostRecent().args[0]).toBe(constants.messages.question.dragAndDropText.dropspotPositionChangedByCollaborator);
        });
    });
})