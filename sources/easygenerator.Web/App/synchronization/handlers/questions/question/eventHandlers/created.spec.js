define(['synchronization/handlers/questions/question/eventHandlers/created'], function (handler) {
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
            modifiedOn = new Date();

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

        describe('when question is already exists in objective', function() {
            beforeEach(function() {
                objective.questions = [{ id: question.Id }];
                dataContext.objectives = [objective];
            });

            it('should not add new question to objective', function () {
                handler(objective.id, question, modifiedOn.toISOString());
                expect(dataContext.objectives[0].questions.length).toBe(1);
            });

            it('should not update objective modified on date', function () {
                objective.modifiedOn = "";
                handler(objective.id, question, modifiedOn.toISOString());
                expect(dataContext.objectives[0].modifiedOn).toBe('');
            });

            it('should not trigger app event', function () {
                handler(objective.id, question, modifiedOn.toISOString());
                expect(app.trigger).not.toHaveBeenCalled();
            });
        });

        describe('when question is not exist in objective', function() {
            beforeEach(function() {
                objective.questions = [];
                dataContext.objectives = [objective];
            });

            it('should add new question to objective', function () {
                handler(objective.id, question, modifiedOn.toISOString());
                expect(dataContext.objectives[0].questions.length).toBe(1);
                expect(dataContext.objectives[0].questions[0].id).toBe(question.Id);
            });

            it('should update objective modified on date', function () {
                dataContext.objectives = [objective];
                handler(objective.id, question, modifiedOn.toISOString());
                expect(dataContext.objectives[0].modifiedOn.toISOString()).toBe(modifiedOn.toISOString());
            });

            it('should trigger app event', function () {
                handler(objective.id, question, modifiedOn.toISOString());
                expect(app.trigger).toHaveBeenCalled();
                expect(app.trigger.calls.mostRecent().args[0]).toEqual(constants.messages.question.createdByCollaborator);
            });
        });
    });

});