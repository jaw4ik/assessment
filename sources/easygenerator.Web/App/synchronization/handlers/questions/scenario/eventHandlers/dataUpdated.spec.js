define(['synchronization/handlers/questions/scenario/eventHandlers/dataUpdated'], function (handler) {
    "use strict";

    var
        dataContext = require('dataContext'),
        app = require('durandal/app'),
        constants = require('constants');

    describe('synchronization scenario [dataUpdated]', function () {

        var questionId = 'questionId',
            projectId = 'projectId',
            embedUrl = 'embedUrl',
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
                    handler(undefined, projectId, embedUrl, modifiedOn.toISOString());
                };

                expect(f).toThrow('QuestionId is not a string');
            });
        });

        describe('when projectId is not a string', function () {
            it('should throw an exception', function () {
                var f = function () {
                    handler(questionId, undefined, embedUrl, modifiedOn.toISOString());
                };

                expect(f).toThrow('ProjectId is not a string');
            });
        });

        describe('when embedUrl is not a string', function () {
            it('should throw an exception', function () {
                var f = function () {
                    handler(questionId, projectId, undefined, modifiedOn.toISOString());
                };

                expect(f).toThrow('EmbedUrl is not a string');
            });
        });

        describe('when modifiedOn is not a date', function () {
            it('should throw an exception', function () {
                var f = function () {
                    handler(questionId, projectId, embedUrl, undefined);
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
                    handler(questionId, projectId, embedUrl, modifiedOn.toISOString());
                };

                expect(f).toThrow('Question has not been found');
            });
        });

        it('should update question modified on date', function () {
            question.modifiedOn = '';
            spyOn(dataContext, 'getQuestions').and.returnValue([question]);
            handler(questionId, projectId, embedUrl, modifiedOn.toISOString());
            expect(question.modifiedOn.toISOString()).toBe(modifiedOn.toISOString());
        });

        it('should trigger app event', function () {
            spyOn(dataContext, 'getQuestions').and.returnValue([question]);
            handler(questionId, projectId, embedUrl, modifiedOn.toISOString());
            expect(app.trigger).toHaveBeenCalledWith(constants.messages.question.scenario.dataUpdated, questionId, projectId, embedUrl);
        });
    });
});