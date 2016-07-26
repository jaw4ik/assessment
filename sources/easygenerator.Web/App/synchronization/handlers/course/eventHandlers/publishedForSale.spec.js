import handler from './publishedForSale';

import dataContext from 'dataContext';
import app from 'durandal/app';

describe('synchronization course [publishedForSale]', function () {

    var course = { Id: 'courseId' },
        mappedCourse = { id: course.Id, collaborators: [], saleInfo: { isProcessing: false } };

    beforeEach(function() {
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

    describe('when course is not found in data context', function () {
        it('should throw an exception', function () {
            dataContext.courses = [];

            var f = function () {
                handler(mappedCourse.id);
            };

            expect(f).toThrow('Course has not been found');
        });
    });

    it('should update course isProcessing', function () {
        dataContext.courses = [mappedCourse];

        handler(mappedCourse.id);
        expect(mappedCourse.saleInfo.isProcessing).toBeTruthy();
    });

    it('should trigger app event', function () {
        dataContext.courses = [mappedCourse];
        handler(mappedCourse.id);
        expect(app.trigger).toHaveBeenCalled();
    });

});
