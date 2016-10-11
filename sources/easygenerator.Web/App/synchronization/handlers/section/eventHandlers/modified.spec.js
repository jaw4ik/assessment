import handler from './modified';

import dataContext from 'dataContext';
import app from 'durandal/app';
import constants from 'constants';

describe('synchronization section [modified]', function () {

    var section = { Id: 'sectionId', modifiedOn: (new Date()).toString() };

    beforeEach(function () {
        spyOn(app, 'trigger');
    });

    it('should be function', function () {
        expect(handler).toBeFunction();
    });

    describe('when sectionId is not a string', function () {
        it('should throw an exception', function () {
            var f = function () {
                handler(undefined, section.modifiedOn);
            };

            expect(f).toThrow('SectionId is not a string');
        });
    });

    describe('when modifiedOn is not a date', function () {
        it('should throw an exception', function () {
            var f = function () {
                handler(section.id, undefined);
            };

            expect(f).toThrow('ModifiedOn is not a date');
        });
    });

    describe('when section is not found', function () {
        it('should not trigger app event', function () {
            dataContext.sections = [];
            
            var f = function () {
                handler(section.id, section.modifiedOn);
            };

            expect(f).toThrow('Section has not been found');
        });
    });

    it('should set section modifiedOn date', function () {
        dataContext.sections = [section];

        var newDate = (new Date()).toString();

        handler(section.id, newDate);
        expect(dataContext.sections[0].modifiedOn).toBe(newDate);
    });

    it('should trigger app event', function () {
        dataContext.sections = [section];
        
        handler(section.id, section.modifiedOn);
        expect(app.trigger).toHaveBeenCalledWith(constants.messages.section.modified);
    });
});
