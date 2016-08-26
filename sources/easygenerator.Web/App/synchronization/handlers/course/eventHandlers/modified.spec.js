import handler from './modified';

import dataContext from 'dataContext';
import app from 'durandal/app';
import constants from 'constants';

describe('synchronization course [modified]', function () {

    var course = { Id: 'courseId', modifiedOn: (new Date()).toString() };

    beforeEach(function () {
        spyOn(app, 'trigger');
    });

    it('should be function', function () {
        expect(handler).toBeFunction();
    });

    describe('when courseId is not a string', function () {
        it('should throw an exception', function () {
            var f = function () {
                handler(undefined, course.modifiedOn);
            };

            expect(f).toThrow('CourseId is not a string');
        });
    });

    describe('when modifiedOn is not a date', function () {
        it('should throw an exception', function () {
            var f = function () {
                handler(course.id, undefined);
            };

            expect(f).toThrow('ModifiedOn is not a date');
        });
    });

    describe('when course is not found', function () {
        it('should not trigger app event', function () {
            dataContext.courses = [];
            
            var f = function () {
                handler(course.id, course.modifiedOn);
            };

            expect(f).toThrow('Course has not been found');
        });
    });

    it('should set course modifiedOn date', function () {
        dataContext.courses = [course];

        var newDate = (new Date()).toString();

        handler(course.id, newDate);
        expect(dataContext.courses[0].modifiedOn).toBe(newDate);
    });

    it('should trigger app event', function () {
        dataContext.courses = [course];
        
        handler(course.id, course.modifiedOn);
        expect(app.trigger).toHaveBeenCalledWith(constants.messages.course.modified);
    });
});
