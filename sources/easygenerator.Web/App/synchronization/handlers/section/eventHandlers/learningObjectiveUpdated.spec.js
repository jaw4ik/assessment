import handler from './learningObjectiveUpdated';
import _ from 'underscore';
import app from 'durandal/app';
import guard from 'guard';
import constants from 'constants';
import dataContext from 'dataContext';

describe('synchronization section [learningObjectiveUpdated]', () => {
    
    let section = { id: 'sectionId' };
    let learningObjective = "Learning objective";
    let modifiedOn = new Date();

    beforeEach(() => {
        spyOn(app, 'trigger');
    });

    it('should be function', () => {
        expect(handler).toBeFunction();
    });

    describe('when section id is not a string', () => {

        it('should throw an exception', () => {
            let action = () => handler(undefined, learningObjective, modifiedOn.toISOString());
            expect(action).toThrow('SectionId is not a string');
        });

    });

    describe('when learningObjective is not a string', () => {

        it('should throw an exceprion', () => {
            let action = () => handler(section.id, undefined, modifiedOn.toISOString());
            expect(action).toThrow('Learning section is not a string');
        });

    });

    describe('when modifiedOn is not a date', () => {

        it('should trow an exception', () => {
            let action = () => handler(section.id, learningObjective, undefined);
            expect(action).toThrow('ModifiedOn is not a string');
        });

    });

    describe('when section is not found in data context', () => {

        it('should throw an exception', () => {
            dataContext.sections = [];

            let action = () => handler(section.id, learningObjective, modifiedOn.toISOString());

            expect(action).toThrow('Section has not been found');
        });

    });

    it('should update section learningObjective', () => {
        section.learningObjective = '';
        dataContext.sections = [section];
        handler(section.id, learningObjective, modifiedOn.toISOString());

        expect(dataContext.sections[0].learningObjective).toBe(learningObjective);
    });

    it('should update section modified on date', function () {
        section.modifiedOn = '';
        dataContext.sections = [section];
        handler(section.id, learningObjective, modifiedOn.toISOString());

        expect(dataContext.sections[0].modifiedOn.toISOString()).toBe(modifiedOn.toISOString());
    });

    it('should trigger app event', function () {
        dataContext.sections = [section];
        handler(section.id, learningObjective, modifiedOn.toISOString());
        expect(app.trigger).toHaveBeenCalledWith(constants.messages.section.learningObjectiveUpdatedByCollaborator, section);
    });
});