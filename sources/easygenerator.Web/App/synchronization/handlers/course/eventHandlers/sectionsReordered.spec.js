import handler from './sectionsReordered';

import dataContext from 'dataContext';
import app from 'durandal/app';

describe('synchronization course [sectionsReordered]', function () {

    var course = { Id: 'courseId' },
        mappedCourse = { id: course.Id, collaborators: [] };

    beforeEach(function () {
        spyOn(app, 'trigger');
    });

    var modifiedOn = new Date(),
        sectionId1 = 'obj1',
        sectionId2 = 'obj2',
        sectionsOrder = [sectionId2, sectionId1],
        sections = [{ id: sectionId1 }, { id: sectionId2 }];

    it('should be function', function () {
        expect(handler).toBeFunction();
    });

    describe('when courseId is not a string', function () {
        it('should throw an exception', function () {
            var f = function () {
                handler(undefined, sectionsOrder, modifiedOn.toISOString());
            };

            expect(f).toThrow('CourseId is not a string');
        });
    });

    describe('when templateId is not a string', function () {
        it('should throw an exception', function () {
            var f = function () {
                handler(mappedCourse.id, undefined, modifiedOn.toISOString());
            };

            expect(f).toThrow('SectionIds is not an array');
        });
    });

    describe('when modifiedOn is not a date', function () {
        it('should throw an exception', function () {
            var f = function () {
                handler(mappedCourse.id, sectionsOrder, undefined);
            };

            expect(f).toThrow('ModifiedOn is not a string');
        });
    });

    describe('when course is not found in data context', function () {
        it('should throw an exception', function () {
            dataContext.courses = [];

            var f = function () {
                handler(mappedCourse.id, sectionsOrder, modifiedOn.toISOString());
            };

            expect(f).toThrow('Course has not been found');
        });
    });

    it('should update course sections order', function () {
        mappedCourse.sections = sections;
        dataContext.courses = [mappedCourse];

        handler(mappedCourse.id, sectionsOrder, modifiedOn.toISOString());
        expect(dataContext.courses[0].sections[0].id).toBe(sectionId2);
        expect(dataContext.courses[0].sections[1].id).toBe(sectionId1);
    });

    it('should update course modified on date', function () {
        mappedCourse.modifiedOn = "";
        dataContext.courses = [mappedCourse];
        mappedCourse.sections = sections;

        handler(mappedCourse.id, sectionsOrder, modifiedOn.toISOString());
        expect(dataContext.courses[0].modifiedOn.toISOString()).toBe(modifiedOn.toISOString());
    });

    it('should trigger app event', function () {
        dataContext.courses = [mappedCourse];
        mappedCourse.sections = sections;

        handler(mappedCourse.id, sectionsOrder, modifiedOn.toISOString());
        expect(app.trigger).toHaveBeenCalled();
    });

});
