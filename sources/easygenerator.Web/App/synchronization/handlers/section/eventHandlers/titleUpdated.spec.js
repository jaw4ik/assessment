import handler from './titleUpdated';

import dataContext from 'dataContext';
import constants from 'constants';
import app from 'durandal/app';

describe('synchronization section [titleUpdated]', function () {

    var section = { id: 'sectionId' };

    beforeEach(function () {
        spyOn(app, 'trigger');
    });

    var title = "title",
        modifiedOn = new Date();

    it('should be function', function () {
        expect(handler).toBeFunction();
    });

    describe('when sectionId is not a string', function () {
        it('should throw an exception', function () {
            var f = function () {
                handler(undefined, title, modifiedOn.toISOString());
            };

            expect(f).toThrow('SectionId is not a string');
        });
    });

    describe('when title is not a string', function () {
        it('should throw an exception', function () {
            var f = function () {
                handler(section.id, undefined, modifiedOn.toISOString());
            };

            expect(f).toThrow('Title is not a string');
        });
    });

    describe('when modifiedOn is not a date', function () {
        it('should throw an exception', function () {
            var f = function () {
                handler(section.id, title, undefined);
            };

            expect(f).toThrow('ModifiedOn is not a string');
        });
    });

    describe('when section is not found in data context', function () {
        it('should throw an exception', function () {
            dataContext.sections = [];

            var f = function () {
                handler(section.id, title, modifiedOn.toISOString());
            };

            expect(f).toThrow('Section has not been found');
        });
    });

    it('should update section title', function () {
        section.title = "";
        dataContext.sections = [section];
        handler(section.id, title, modifiedOn.toISOString());

        expect(dataContext.sections[0].title).toBe(title);
    });

    it('should update section modified on date', function () {
        section.modifiedOn = "";
        dataContext.sections = [section];
        handler(section.id, title, modifiedOn.toISOString());

        expect(dataContext.sections[0].modifiedOn.toISOString()).toBe(modifiedOn.toISOString());
    });

    it('should trigger app event', function () {
        dataContext.sections = [section];
        handler(section.id, title, modifiedOn.toISOString());
        expect(app.trigger).toHaveBeenCalledWith(constants.messages.section.titleUpdatedByCollaborator, section);
    });
});
