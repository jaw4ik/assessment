define(['synchronization/handlers/objective/eventHandlers/imageUrlUpdated'], function (handler) {
    "use strict";

    var
        dataContext = require('dataContext'),
        constants = require('constants'),
        app = require('durandal/app')
    ;

    describe('synchronization objective [imageUrlUpdated]', function () {

        var objective = { id: 'objectiveId' };

        beforeEach(function () {
            spyOn(app, 'trigger');
        });

        var modifiedOn = new Date(),
            imageUrl = 'url/to/image';

        it('should be function', function () {
            expect(handler).toBeFunction();
        });

        describe('when objectiveId is not a string', function () {
            it('should throw an exception', function () {
                var f = function () {
                    handler(undefined, imageUrl, modifiedOn.toISOString());
                };

                expect(f).toThrow('ObjectiveId is not a string');
            });
        });

        describe('when imageUrl is not a string', function () {
            it('should throw an exception', function () {
                var f = function () {
                    handler(objective.id, undefined, modifiedOn.toISOString());
                };

                expect(f).toThrow('ImageUrl is not a string');
            });
        });

        describe('when modifiedOn is not a date', function () {
            it('should throw an exception', function () {
                var f = function () {
                    handler(objective.id, imageUrl, undefined);
                };

                expect(f).toThrow('ModifiedOn is not a string');
            });
        });

        describe('when objective is not found in data context', function () {
            it('should throw an exception', function () {
                dataContext.objectives = [];

                var f = function () {
                    handler(objective.id, imageUrl, modifiedOn.toISOString());
                };

                expect(f).toThrow('Objective has not been found');
            });
        });

        it('should update objective image', function () {
            objective.image = '';
            dataContext.objectives = [objective];

            handler(objective.id, imageUrl, modifiedOn.toISOString());
            expect(dataContext.objectives[0].image).toBe(imageUrl);
        });

        it('should update objective modified on date', function () {
            objective.modifiedOn = "";
            dataContext.objectives = [objective];

            handler(objective.id, imageUrl, modifiedOn.toISOString());
            expect(dataContext.objectives[0].modifiedOn.toISOString()).toBe(modifiedOn.toISOString());
        });

        it('should trigger app event', function () {
            dataContext.objectives = [objective];

            handler(objective.id, imageUrl, modifiedOn.toISOString());
            expect(app.trigger).toHaveBeenCalledWith(constants.messages.objective.imageUrlUpdatedByCollaborator, objective);
        });
    });

})