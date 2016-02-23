import handler from './learningObjectiveUpdated';
import _ from 'underscore';
import app from 'durandal/app';
import guard from 'guard';
import constants from 'constants';
import dataContext from 'dataContext';

describe('synchronization objective [learningObjectiveUpdated]', () => {
    
    let objective = { id: 'objectiveId' };
    let learningObjective = "Learning objective";
    let modifiedOn = new Date();

    beforeEach(() => {
        spyOn(app, 'trigger');
    });

    it('should be function', () => {
        expect(handler).toBeFunction();
    });

    describe('when objective id is not a string', () => {

        it('should throw an exception', () => {
            let action = () => handler(undefined, learningObjective, modifiedOn.toISOString());
            expect(action).toThrow('ObjectiveId is not a string');
        });

    });

    describe('when learningObjective is not a string', () => {

        it('should throw an exceprion', () => {
            let action = () => handler(objective.id, undefined, modifiedOn.toISOString());
            expect(action).toThrow('Learning objective is not a string');
        });

    });

    describe('when modifiedOn is not a date', () => {

        it('should trow an exception', () => {
            let action = () => handler(objective.id, learningObjective, undefined);
            expect(action).toThrow('ModifiedOn is not a string');
        });

    });

    describe('when objective is not found in data context', () => {

        it('should throw an exception', () => {
            dataContext.objectives = [];

            let action = () => handler(objective.id, learningObjective, modifiedOn.toISOString());

            expect(action).toThrow('Objective has not been found');
        });

    });

    it('should update objective learningObjective', () => {
        objective.learningObjective = '';
        dataContext.objectives = [objective];
        handler(objective.id, learningObjective, modifiedOn.toISOString());

        expect(dataContext.objectives[0].learningObjective).toBe(learningObjective);
    });

    it('should update objective modified on date', function () {
        objective.modifiedOn = '';
        dataContext.objectives = [objective];
        handler(objective.id, learningObjective, modifiedOn.toISOString());

        expect(dataContext.objectives[0].modifiedOn.toISOString()).toBe(modifiedOn.toISOString());
    });

    it('should trigger app event', function () {
        dataContext.objectives = [objective];
        handler(objective.id, learningObjective, modifiedOn.toISOString());
        expect(app.trigger).toHaveBeenCalledWith(constants.messages.objective.learningObjectiveUpdatedByCollaborator, objective);
    });
});