import handler from './sectionRelated';

import dataContext from 'dataContext';
import app from 'durandal/app';
import sectionModelMapper from 'mappers/sectionModelMapper';

describe('synchronization course [sectionRelated]', function () {

    var course = { Id: 'courseId' },
        mappedCourse = { id: course.Id, collaborators: [] };

    beforeEach(function () {
        spyOn(app, 'trigger');
    });

    var modifiedOn = new Date(),
        sectionId = 'obj1',
        courseId = mappedCourse.id,
        section = { id: sectionId },
        sectionData = { id: sectionId };

    beforeEach(function () {
        spyOn(sectionModelMapper, 'map').and.returnValue(section);
    });

    it('should be function', function () {
        expect(handler).toBeFunction();
    });

    describe('when courseId is not a string', function () {
        it('should throw an exception', function () {
            var f = function () {
                handler(undefined, sectionData, 0, modifiedOn.toISOString());
            };

            expect(f).toThrow('CourseId is not a string');
        });
    });

    describe('when section is not an object', function () {
        it('should throw an exception', function () {
            var f = function () {
                handler(courseId, undefined, 0, modifiedOn.toISOString());
            };

            expect(f).toThrow('Section is not an object');
        });
    });

    describe('when modifiedOn is not a string', function () {
        it('should throw an exception', function () {
            var f = function () {
                handler(courseId, sectionData, 0, undefined);
            };

            expect(f).toThrow('ModifiedOn is not a string');
        });
    });

    describe('when course is not found in data context', function () {
        it('should throw an exception', function () {
            dataContext.courses = [];

            var f = function () {
                handler(courseId, sectionData, 0, modifiedOn.toISOString());
            };

            expect(f).toThrow('Course has not been found');
        });
    });

    describe('when section is not found in data context', function () {
        it('should push section to data context', function () {
            dataContext.courses = [mappedCourse];
            dataContext.sections = [];

            handler(courseId, sectionData, 0, modifiedOn.toISOString());

            expect(dataContext.sections.length).toBe(1);
        });
    });

    describe('when target index is not defined', function () {
        it('should push section to course', function () {
            dataContext.courses = [mappedCourse];
            dataContext.sections = [section];
            mappedCourse.sections = [];

            handler(courseId, sectionData, 0, modifiedOn.toISOString());

            expect(dataContext.courses[0].sections.length).toBe(1);
        });
    });

    describe('when target index is defined', function () {
        it('should insert section with target index', function () {
            dataContext.courses = [mappedCourse];
            var obj = { id: 'id' };
            dataContext.sections = [section, obj];
            mappedCourse.sections = [obj];

            handler(courseId, sectionData, 0, modifiedOn.toISOString());

            expect(dataContext.courses[0].sections[0].id).toBe(sectionId);
        });
    });

    it('should update course modified on date', function () {
        mappedCourse.modifiedOn = "";
        dataContext.courses = [mappedCourse];
        dataContext.sections = [section];
        mappedCourse.sections = [];

        handler(courseId, sectionData, 0, modifiedOn.toISOString());
        expect(dataContext.courses[0].modifiedOn.toISOString()).toBe(modifiedOn.toISOString());
    });

    it('should trigger app event', function () {
        dataContext.courses = [mappedCourse];
        dataContext.sections = [section];
        mappedCourse.sections = [];

        handler(courseId, sectionData, 0, modifiedOn.toISOString());
        expect(app.trigger).toHaveBeenCalled();
    });
});
