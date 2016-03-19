import handler from './deleted';

import dataContext from 'dataContext';
import app from 'durandal/app';

describe('synchronization course [deleted]', function () {

    var course = { Id: 'courseId' },
        sectionId = "sectionId",
        mappedCourse = { id: course.Id, collaborators: [] };

    beforeEach(function () {
        spyOn(app, 'trigger');
    });

    it('should be function', function () {
        expect(handler).toBeFunction();
    });

    describe('when courseId is not a string', function () {
        it('should throw an exception', function () {
            var f = function () {
                handler(undefined);
            };

            expect(f).toThrow('CourseId is not a string');
        });
    });

    describe('when deletedSectionIds is not an array', function () {
        it('should throw an exception', function () {
            var f = function () {
                handler(mappedCourse.id, undefined);
            };

            expect(f).toThrow('DeletedSectionIds is not an array');
        });
    });

    describe('when course is not found', function () {
        it('should not trigger app event', function () {
            dataContext.courses = [];
            handler(mappedCourse.id, []);
            expect(app.trigger).not.toHaveBeenCalled();
        });
    });

    it('should delete course', function () {
        dataContext.courses = [mappedCourse];

        handler(mappedCourse.id, []);
        expect(dataContext.courses.length).toBe(0);
    });

    it('should delete sections', function () {
        dataContext.courses = [mappedCourse];
        dataContext.sections = [{ id: sectionId }];

        handler(mappedCourse.id, [sectionId]);
        expect(dataContext.sections.length).toBe(0);
    });

    it('should trigger app event', function () {
        dataContext.courses = [mappedCourse];
        handler(mappedCourse.id, []);
        expect(app.trigger).toHaveBeenCalled();
    });

});
