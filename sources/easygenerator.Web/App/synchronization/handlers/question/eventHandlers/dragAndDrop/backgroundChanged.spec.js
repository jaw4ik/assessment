﻿define(['synchronization/handlers/question/eventHandlers/dragAndDrop/backgroundChanged'], function (handler) {
    "use strict";

    var
            dataContext = require('dataContext'),
        app = require('durandal/app'),
        constants = require('constants')
    ;

    describe('synchronization dragAndDrop [backgroundChanged]', function () {

        var questionId = 'id',
            question = { id: questionId },
            background = 'imageUrl',
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
                    handler(undefined, background, modifiedOn.toISOString());
                };

                expect(f).toThrow('QuestionId is not a string');
            });
        });

        describe('when background is not a string', function () {
            it('should throw an exception', function () {
                var f = function () {
                    handler(questionId, undefined, modifiedOn.toISOString());
                };

                expect(f).toThrow('Background is not a string');
            });
        });

        describe('when modifiedOn is not a date', function () {
            it('should throw an exception', function () {
                var f = function () {
                    handler(questionId, background, undefined);
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
                    handler(questionId, background, modifiedOn.toISOString());
                };

                expect(f).toThrow('Question has not been found');
            });
        });

        it('should update question background', function () {
            question.background = '';
            spyOn(dataContext, 'getQuestions').and.returnValue([question]);
            handler(questionId, background, modifiedOn.toISOString());

            expect(question.background).toBe(background);
        });

        it('should update question modified on date', function () {
            question.modifiedOn = '';
            spyOn(dataContext, 'getQuestions').and.returnValue([question]);
            handler(questionId, background, modifiedOn.toISOString());

            expect(question.modifiedOn.toISOString()).toBe(modifiedOn.toISOString());
        });

        it('should trigger app event', function () {
            spyOn(dataContext, 'getQuestions').and.returnValue([question]);
            handler(questionId, background, modifiedOn.toISOString());
            expect(app.trigger).toHaveBeenCalledWith(constants.messages.question.dragAndDrop.backgroundChangedByCollaborator, question);
        });
    });
})