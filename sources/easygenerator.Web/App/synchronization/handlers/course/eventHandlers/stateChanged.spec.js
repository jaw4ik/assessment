import handler from './stateChanged';

import dataContext from 'dataContext';
import app from 'durandal/app';
import constants from 'constants';

describe('synchronization course [stateChanged]', function () {

    var course = { Id: 'courseId' },
        state = { isDirty: false },
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

    describe('when state is not an object', function () {
        it('should throw an exception', function () {
            var f = function () {
                handler(mappedCourse.id, undefined);
            };

            expect(f).toThrow('State is not an object');
        });
    });

    describe('when state isDirty is not a boolean', function () {
        it('should throw an exception', function () {
            var f = function () {
                handler(mappedCourse.id, {});
            };

            expect(f).toThrow('State isDirty is not a boolean');
        });
    });

    describe('when course is not found in data context', function () {
        it('should throw an exception', function () {
            dataContext.courses = [];

            var f = function () {
                handler(mappedCourse.id, state);
            };

            expect(f).toThrow('Course has not been found');
        });
    });

    describe('when course isDirty has not changed', function () {
        beforeEach(function () {
            mappedCourse.isDirty = false;
            state.isDirty = false;
            dataContext.courses = [mappedCourse];
        });

        it('should not update isDirty', function () {
            handler(mappedCourse.id, state);

            expect(dataContext.courses[0].isDirty).toBeFalsy();
        });

        it('should not trigger app event', function () {
            handler(mappedCourse.id, state);
            expect(app.trigger).not.toHaveBeenCalled();
        });
    });

    describe('when course isDirty has changed', function () {
        beforeEach(function () {
            mappedCourse.isDirty = false;
            state.isDirty = true;
            dataContext.courses = [mappedCourse];
        });

        it('should set isDirty to true', function () {
            handler(mappedCourse.id, state);

            expect(dataContext.courses[0].isDirty).toBeTruthy();
        });

        it('should trigger app event', function () {
            handler(mappedCourse.id, state);
            expect(app.trigger).toHaveBeenCalledWith(constants.messages.course.stateChanged + mappedCourse.id, state);
        });
    });
});
