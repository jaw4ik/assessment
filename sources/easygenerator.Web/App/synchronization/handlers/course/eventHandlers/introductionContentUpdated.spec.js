import handler from './introductionContentUpdated';

import dataContext from 'dataContext';
import app from 'durandal/app';

describe('synchronization course [introductionContentUpdated]', function () {

    var course = { Id: 'courseId' },
        mappedCourse = { id: course.Id, collaborators: [] };

    beforeEach(function () {
        spyOn(app, 'trigger');
    });

    var introductionContent = "introductionContent",
        modifiedOn = new Date();

    it('should be function', function () {
        expect(handler).toBeFunction();
    });

    describe('when courseId is not a string', function () {
        it('should throw an exception', function () {
            var f = function () {
                handler(undefined, introductionContent, modifiedOn.toISOString());
            };

            expect(f).toThrow('CourseId is not a string');
        });
    });

    describe('when modifiedOn is not a date', function () {
        it('should throw an exception', function () {
            var f = function () {
                handler(mappedCourse.id, introductionContent, undefined);
            };

            expect(f).toThrow('ModifiedOn is not a string');
        });
    });

    describe('when course is not found in data context', function () {
        it('should throw an exception', function () {
            dataContext.courses = [];

            var f = function () {
                handler(mappedCourse.id, introductionContent, modifiedOn.toISOString());
            };

            expect(f).toThrow('Course has not been found');
        });
    });

    it('should update course introductionContent', function () {
        mappedCourse.title = "";
        dataContext.courses = [mappedCourse];
        handler(mappedCourse.id, introductionContent, modifiedOn.toISOString());

        expect(dataContext.courses[0].introductionContent).toBe(introductionContent);
    });

    it('should update course modified on date', function () {
        mappedCourse.modifiedOn = "";
        dataContext.courses = [mappedCourse];
        handler(mappedCourse.id, introductionContent, modifiedOn.toISOString());

        expect(dataContext.courses[0].modifiedOn.toISOString()).toBe(modifiedOn.toISOString());
    });

    it('should trigger app event', function () {
        dataContext.courses = [mappedCourse];
        handler(mappedCourse.id, introductionContent, modifiedOn.toISOString());
        expect(app.trigger).toHaveBeenCalled();
    });
});
