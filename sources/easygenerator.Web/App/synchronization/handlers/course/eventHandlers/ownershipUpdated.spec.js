import handler from './ownershipUpdated';

import dataContext from 'dataContext';
import app from 'durandal/app';
import constants from 'constants';

describe('synchronization course [ownershipUpdated]', () => {

    var course = { Id: 'courseId' },
        ownership = constants.courseOwnership.shared,
        mappedCourse = { id: course.Id, collaborators: [] };

    beforeEach(() => {
        spyOn(app, 'trigger');
    });

    it('should be function', () => {
        expect(handler).toBeFunction();
    });

    describe('when courseId is not a string', () => {
        it('should throw an exception', () => {
            var f = () => {
                handler(undefined, ownership);
            };

            expect(f).toThrow('courseId is not a string');
        });
    });

    describe('when ownership is not a number', () => {
        it('should throw an exception', () => {
            var f = () => {
                handler(mappedCourse.id, undefined);
            };

            expect(f).toThrow('ownership is not a number');
        });
    });

    describe('when course is not found in data context', () => {
        it('should throw an exception', () => {
            dataContext.courses = [];

            var f = () => {
                handler(mappedCourse.id, ownership);
            };

            expect(f).toThrow('Course has not been found');
        });
    });

    it('should update course ownership', () => {
        mappedCourse.ownership = constants.courseOwnership.owned;
        dataContext.courses = [mappedCourse];
        handler(mappedCourse.id, ownership);

        expect(dataContext.courses[0].ownership).toBe(ownership);
    });

    it('should trigger app event', () => {
        dataContext.courses = [mappedCourse];
        handler(mappedCourse.id, ownership);
        expect(app.trigger).toHaveBeenCalledWith(constants.messages.course.ownershipUpdated, mappedCourse.id, ownership);
    });
});
