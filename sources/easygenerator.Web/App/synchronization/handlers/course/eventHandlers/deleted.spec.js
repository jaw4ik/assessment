define(['synchronization/handlers/course/eventHandlers/deleted'], function (handler) {
    "use strict";

    var
        dataContext = require('dataContext'),
        app = require('durandal/app')
    ;

    describe('synchronization course [deleted]', function () {

        var course = { Id: 'courseId' },
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

        describe('when course is not found', function () {
            it('should not trigger app event', function () {
                dataContext.courses = [];
                handler(mappedCourse.id);
                expect(app.trigger).not.toHaveBeenCalled();
            });
        });

        it('should update course package url', function () {
            dataContext.courses = [mappedCourse];

            handler(mappedCourse.id);
            expect(dataContext.courses.length).toBe(0);
        });

        it('should trigger app event', function () {
            dataContext.courses = [mappedCourse];
            handler(mappedCourse.id);
            expect(app.trigger).toHaveBeenCalled();
        });

    });

})