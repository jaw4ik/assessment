define(['synchronization/handlers/objectiveEventHandler'], function (handler) {
    "use strict";

    var
        dataContext = require('dataContext'),
        app = require('durandal/app')
    ;

    describe('synchronization [objectiveEventHandler]', function () {

        var objective = { id: 'objectiveId' };

        beforeEach(function () {
            spyOn(app, 'trigger');
        });

        describe('objectiveTitleUpdated:', function () {

            var title = "title",
                modifiedOn = new Date();

            it('should be function', function () {
                expect(handler.objectiveTitleUpdated).toBeFunction();
            });

            describe('when objectiveId is not a string', function () {
                it('should throw an exception', function () {
                    var f = function () {
                        handler.objectiveTitleUpdated(undefined, title, modifiedOn.toISOString());
                    };

                    expect(f).toThrow('ObjectiveId is not a string');
                });
            });

            describe('when title is not a string', function () {
                it('should throw an exception', function () {
                    var f = function () {
                        handler.objectiveTitleUpdated(objective.id, undefined, modifiedOn.toISOString());
                    };

                    expect(f).toThrow('Title is not a string');
                });
            });

            describe('when modifiedOn is not a date', function () {
                it('should throw an exception', function () {
                    var f = function () {
                        handler.objectiveTitleUpdated(objective.id, title, undefined);
                    };

                    expect(f).toThrow('ModifiedOn is not a string');
                });
            });

            describe('when objective is not found in data context', function () {
                it('should throw an exception', function () {
                    dataContext.objectives = [];

                    var f = function () {
                        handler.objectiveTitleUpdated(objective.id, title, modifiedOn.toISOString());
                    };

                    expect(f).toThrow('Objective has not been found');
                });
            });

            it('should update objective title', function () {
                objective.title = "";
                dataContext.objectives = [objective];
                handler.objectiveTitleUpdated(objective.id, title, modifiedOn.toISOString());

                expect(dataContext.objectives[0].title).toBe(title);
            });

            it('should update objective modified on date', function () {
                objective.modifiedOn = "";
                dataContext.objectives = [objective];
                handler.objectiveTitleUpdated(objective.id, title, modifiedOn.toISOString());

                expect(dataContext.objectives[0].modifiedOn.toISOString()).toBe(modifiedOn.toISOString());
            });

            it('should trigger app event', function () {
                dataContext.objectives = [objective];
                handler.objectiveTitleUpdated(objective.id, title, modifiedOn.toISOString());
                expect(app.trigger).toHaveBeenCalled();
            });
        });

    });

})