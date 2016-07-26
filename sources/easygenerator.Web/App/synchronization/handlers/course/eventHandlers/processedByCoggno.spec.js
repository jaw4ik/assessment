import handler from './processedByCoggno';

import dataContext from 'dataContext';
import app from 'durandal/app';

describe('synchronization course [progressedByCoggno]', function () {

    var course = { Id: 'courseId' },
        mappedCourse = { id: course.Id, collaborators: [], saleInfo: { isProcessing: true }, publishToCoggno: {} },
        documentId = 'id';

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

        handler(mappedCourse.id, documentId, false);
        expect(mappedCourse.saleInfo.isProcessing).toBeFalsy();
    });

    it('should trigger app event', function () {
        dataContext.courses = [mappedCourse];
        handler(mappedCourse.id, documentId, false);
        expect(app.trigger).toHaveBeenCalled();
    });

    describe('when success = true', function() {

        describe('and documentId is not a string', function() {

            it('should throw', function() {
                dataContext.courses = [mappedCourse];

                var f = function () {
                    handler(mappedCourse.id, undefined, true);
                };

                expect(f).toThrow('DocumentId is not a string');
            });

        });

        describe('and documentId is string', function() {

            it('should set packageUrl', function() {
                dataContext.courses = [mappedCourse];
                handler(mappedCourse.id, documentId, true);
                expect(mappedCourse.publishToCoggno.packageUrl).toBe(documentId);
            });

        });

    });

});
