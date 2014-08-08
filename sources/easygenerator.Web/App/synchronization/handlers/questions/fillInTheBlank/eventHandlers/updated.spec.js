﻿define(['synchronization/handlers/questions/fillInTheBlank/eventHandlers/updated'], function (handler) {
    "use strict";

    var
        dataContext = require('dataContext'),
        app = require('durandal/app'),
        constants = require('constants')
    ;

    describe('synchronization fillInTheBlank [updated]', function () {

        var questionId = 'id',
            question = { id: questionId },
            content = 'content',
            answers = [{ Text: 'text', IsCorrect: 'isCorrect', GroupId: 'groupId' }],
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
                    handler(undefined, content, answers, modifiedOn.toISOString());
                };

                expect(f).toThrow('QuestionId is not a string');
            });
        });

        describe('when modifiedOn is not a date', function () {
            it('should throw an exception', function () {
                var f = function () {
                    handler(questionId, content, answers, undefined);
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
                    handler(questionId, content, answers, modifiedOn.toISOString());
                };

                expect(f).toThrow('Question has not been found');
            });
        });

        it('should update question content', function () {
            question.content = '';
            spyOn(dataContext, 'getQuestions').and.returnValue([question]);

            handler(questionId, content, answers, modifiedOn.toISOString());

            expect(question.content).toBe(content);
        });

        it('should update question modified on date', function () {
            question.modifiedOn = '';
            spyOn(dataContext, 'getQuestions').and.returnValue([question]);

            handler(questionId, content, answers, modifiedOn.toISOString());

            expect(question.modifiedOn.toISOString()).toBe(modifiedOn.toISOString());
        });

        it('should trigger app event', function () {
            var questionData = { content: content, answers: [{ text: 'text', isCorrect: 'isCorrect', groupId: 'groupId' }] };
            spyOn(dataContext, 'getQuestions').and.returnValue([question]);

            handler(questionId, content, answers, modifiedOn.toISOString());

            expect(app.trigger).toHaveBeenCalledWith(constants.messages.question.fillInTheBlank.updatedByCollaborator, questionId, questionData);
        });
    });
})