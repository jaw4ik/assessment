import handler from './titleUpdated';

import dataContext from 'dataContext';
import app from 'durandal/app';

describe('synchronization course [titleUpdated]', function () {

    var course = { Id: 'courseId' },
        mappedCourse = { id: course.Id, collaborators: [] };

    beforeEach(function () {
        spyOn(app, 'trigger');
    });

    var title = "title",
        modifiedOn = new Date();

    it('should be function', function () {
        expect(handler).toBeFunction();
    });

    describe('when courseId is not a string', function () {
        it('should throw an exception', function () {
            var f = function () {
                handler(undefined, title, modifiedOn.toISOString());
            };

            expect(f).toThrow('CourseId is not a string');
        });
    });

    describe('when title is not a string', function () {
        it('should throw an exception', function () {
            var f = function () {
                handler(mappedCourse.id, undefined, modifiedOn.toISOString());
            };

            expect(f).toThrow('Title is not a string');
        });
    });

    describe('when modifiedOn is not a date', function () {
        it('should throw an exception', function () {
            var f = function () {
                handler(mappedCourse.id, title, undefined);
            };

            expect(f).toThrow('ModifiedOn is not a string');
        });
    });

    describe('when course is not found in data context', function () {
        it('should throw an exception', function () {
            dataContext.courses = [];

            var f = function () {
                handler(mappedCourse.id, title, modifiedOn.toISOString());
            };

            expect(f).toThrow('Course has not been found');
        });
    });

    it('should update course title', function () {
        mappedCourse.title = "";
        dataContext.courses = [mappedCourse];
        handler(mappedCourse.id, title, modifiedOn.toISOString());

        expect(dataContext.courses[0].title).toBe(title);
    });

    it('should update course modified on date', function () {
        mappedCourse.modifiedOn = "";
        dataContext.courses = [mappedCourse];
        handler(mappedCourse.id, title, modifiedOn.toISOString());

        expect(dataContext.courses[0].modifiedOn.toISOString()).toBe(modifiedOn.toISOString());
    });

    it('should trigger app event', function () {
        dataContext.courses = [mappedCourse];
        handler(mappedCourse.id, title, modifiedOn.toISOString());
        expect(app.trigger).toHaveBeenCalled();
    });
});
