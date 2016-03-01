import handler from './imageUrlUpdated';

import dataContext from 'dataContext';
import constants from 'constants';
import app from 'durandal/app';

describe('synchronization section [imageUrlUpdated]', function () {

    var section = { id: 'sectionId' };

    beforeEach(function () {
        spyOn(app, 'trigger');
    });

    var modifiedOn = new Date(),
        imageUrl = 'url/to/image';

    it('should be function', function () {
        expect(handler).toBeFunction();
    });

    describe('when sectionId is not a string', function () {
        it('should throw an exception', function () {
            var f = function () {
                handler(undefined, imageUrl, modifiedOn.toISOString());
            };

            expect(f).toThrow('SectionId is not a string');
        });
    });

    describe('when imageUrl is not a string', function () {
        it('should throw an exception', function () {
            var f = function () {
                handler(section.id, undefined, modifiedOn.toISOString());
            };

            expect(f).toThrow('ImageUrl is not a string');
        });
    });

    describe('when modifiedOn is not a date', function () {
        it('should throw an exception', function () {
            var f = function () {
                handler(section.id, imageUrl, undefined);
            };

            expect(f).toThrow('ModifiedOn is not a string');
        });
    });

    describe('when section is not found in data context', function () {
        it('should throw an exception', function () {
            dataContext.sections = [];

            var f = function () {
                handler(section.id, imageUrl, modifiedOn.toISOString());
            };

            expect(f).toThrow('Section has not been found');
        });
    });

    it('should update section image', function () {
        section.image = '';
        dataContext.sections = [section];

        handler(section.id, imageUrl, modifiedOn.toISOString());
        expect(dataContext.sections[0].image).toBe(imageUrl);
    });

    it('should update section modified on date', function () {
        section.modifiedOn = "";
        dataContext.sections = [section];

        handler(section.id, imageUrl, modifiedOn.toISOString());
        expect(dataContext.sections[0].modifiedOn.toISOString()).toBe(modifiedOn.toISOString());
    });

    it('should trigger app event', function () {
        dataContext.sections = [section];

        handler(section.id, imageUrl, modifiedOn.toISOString());
        expect(app.trigger).toHaveBeenCalledWith(constants.messages.section.imageUrlUpdatedByCollaborator, section);
    });
});
