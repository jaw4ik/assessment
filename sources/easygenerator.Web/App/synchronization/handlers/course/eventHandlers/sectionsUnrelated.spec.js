import handler from './sectionsUnrelated';

import dataContext from 'dataContext';
import app from 'durandal/app';
import userContext from 'userContext';

describe('synchronization course [sectionsUnrelated]', function () {

    var course = { Id: 'courseId' },
        mappedCourse = { id: course.Id, collaborators: [] };

    beforeEach(function () {
        spyOn(app, 'trigger');
    });

    var modifiedOn = new Date(),
        sectionId = 'obj1',
        courseId = mappedCourse.id,
        section = { id: sectionId, createdBy: 'user' };

    it('should be function', function () {
        expect(handler).toBeFunction();
    });

    describe('when courseId is not a string', function () {
        it('should throw an exception', function () {
            var f = function () {
                handler(undefined, [sectionId], modifiedOn.toISOString());
            };

            expect(f).toThrow('CourseId is not a string');
        });
    });

    describe('when sectionId is not an array', function () {
        it('should throw an exception', function () {
            var f = function () {
                handler(courseId, undefined, modifiedOn.toISOString());
            };

            expect(f).toThrow('SectionIds is not an array');
        });
    });

    describe('when modifiedOn is not a string', function () {
        it('should throw an exception', function () {
            var f = function () {
                handler(courseId, [sectionId], undefined);
            };

            expect(f).toThrow('ModifiedOn is not a string');
        });
    });

    describe('when course is not found in data context', function () {
        it('should throw an exception', function () {
            dataContext.courses = [];

            var f = function () {
                handler(courseId, [sectionId], modifiedOn.toISOString());
            };

            expect(f).toThrow('Course has not been found');
        });
    });

    it('should unrelate sections from course', function () {
        dataContext.courses = [mappedCourse];
        mappedCourse.sections = [section];

        handler(courseId, [sectionId], modifiedOn.toISOString());

        expect(dataContext.courses[0].sections.length).toBe(0);
    });

    describe('when sections unrelated from collaborator', function() {
            
        it('should unrelate sections from dataContext.sections', function () {
            dataContext.sections = [section];
            userContext.identity = { email: 'anotheruser' };

            handler(courseId, [sectionId], modifiedOn.toISOString());

            expect(dataContext.sections.length).toBe(0);
        });

    });

    it('should update course modified on date', function () {
        mappedCourse.modifiedOn = "";
        dataContext.courses = [mappedCourse];
        dataContext.sections = [section];
        mappedCourse.sections = [section];

        handler(courseId, [sectionId], modifiedOn.toISOString());
        expect(dataContext.courses[0].modifiedOn.toISOString()).toBe(modifiedOn.toISOString());
    });

    it('should trigger app event', function () {
        dataContext.courses = [mappedCourse];
        dataContext.sections = [section];
        mappedCourse.sections = [section];

        handler(courseId, [sectionId], modifiedOn.toISOString());
        expect(app.trigger).toHaveBeenCalled();
    });

});
