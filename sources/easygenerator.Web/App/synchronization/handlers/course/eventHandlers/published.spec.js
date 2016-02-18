import handler from './published';

import dataContext from 'dataContext';
import app from 'durandal/app';

describe('synchronization course [published]', function () {

    var course = { Id: 'courseId' },
        mappedCourse = { id: course.Id, collaborators: [] };

    beforeEach(function () {
        spyOn(app, 'trigger');
    });

    var url = 'url';

    it('should be function', function () {
        expect(handler).toBeFunction();
    });

    describe('when courseId is not a string', function () {
        it('should throw an exception', function () {
            var f = function () {
                handler(undefined, url);
            };

            expect(f).toThrow('CourseId is not a string');
        });
    });

    describe('when publicationUrl is not a string', function () {
        it('should throw an exception', function () {
            var f = function () {
                handler(mappedCourse.id, undefined);
            };

            expect(f).toThrow('PublicationUrl is not a string');
        });
    });

    describe('when course is not found in data context', function () {
        it('should throw an exception', function () {
            dataContext.courses = [];

            var f = function () {
                handler(mappedCourse.id, url);
            };

            expect(f).toThrow('Course has not been found');
        });
    });

    it('should update course package url', function () {
        mappedCourse.publish = {};
        mappedCourse.publish.packageUrl = '';
        dataContext.courses = [mappedCourse];

        handler(mappedCourse.id, url);
        expect(mappedCourse.publish.packageUrl).toBe(url);
    });

    it('should trigger app event', function () {
        mappedCourse.packageUrl = '';
        dataContext.courses = [mappedCourse];
        handler(mappedCourse.id, url);
        expect(app.trigger).toHaveBeenCalled();
    });
});
