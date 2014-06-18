define(['synchronization/handlers/question/eventHandlers/created'], function (handler) {
    "use strict";

    var
        dataContext = require('dataContext'),
        constants = require('constants'),
        app = require('durandal/app')
    ;

    describe('synchronization question [created]', function () {

        var objective = { id: 'objectiveId' };

        beforeEach(function () {
            spyOn(app, 'trigger');
        });

        var question = { Id: '2' },
            modifiedOn = new Date(),
            questions = [{ id: '0' }, { id: '1' }];

        it('should be function', function () {
            expect(handler).toBeFunction();
        });

        describe('when objectiveId is not a string', function () {
            it('should throw an exception', function () {
                var f = function () {
                    handler(undefined, question, modifiedOn.toISOString());
                };

                expect(f).toThrow('ObjectiveId is not a string');
            });
        });

        describe('when question is not object', function () {
            it('should throw an exception', function () {
                var f = function () {
                    handler(objective.id, undefined, modifiedOn.toISOString());
                };

                expect(f).toThrow('Question is not an object');
            });
        });

        describe('when modifiedOn is not a date', function () {
            it('should throw an exception', function () {
                var f = function () {
                    handler(objective.id, question, undefined);
                };

                expect(f).toThrow('ModifiedOn is not a string');
            });
        });

        describe('when objective is not found in data context', function () {
            it('should throw an exception', function () {
                dataContext.objectives = [];

                var f = function () {
                    handler(objective.id, question, modifiedOn.toISOString());
                };

                expect(f).toThrow('Objective has not been found');
            });
        });

        it('should add new question to objective', function () {
            objective.questions = questions;
            dataContext.objectives = [objective];

            handler(objective.id, question, modifiedOn.toISOString());
            expect(dataContext.objectives[0].questions.length).toBe(3);
            expect(dataContext.objectives[0].questions[2].id).toBe(question.Id);
        });

        it('should update objective modified on date', function () {
            objective.modifiedOn = "";
            dataContext.objectives = [objective];
            objective.questions = questions;

            handler(objective.id, question, modifiedOn.toISOString());
            expect(dataContext.objectives[0].modifiedOn.toISOString()).toBe(modifiedOn.toISOString());
        });

        it('should trigger app event', function () {
            dataContext.objectives = [objective];
            objective.questions = questions;

            handler(objective.id, question, modifiedOn.toISOString());
            expect(app.trigger).toHaveBeenCalled();
            expect(app.trigger.calls.mostRecent().args[0]).toEqual(constants.messages.question.createdByCollaborator);
        });
    });

});