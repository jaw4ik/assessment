define(['synchronization/handlers/collaboration/eventHandlers/finished'], function (handler) {
    "use strict";

    var
        dataContext = require('dataContext'),
        app = require('durandal/app'),
        constants = require('constants')
    ;

    describe('synchronization collaboration [finished]', function () {

        var courseId = 'courseId',
            course = { id: courseId };

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

        it('should delete course from data context', function () {
            dataContext.courses = [course];
            handler(courseId);
            expect(dataContext.courses.length).toBe(0);
        });

        it('should trigger app event', function () {
            handler(courseId);
            expect(app.trigger).toHaveBeenCalledWith(constants.messages.course.collaboration.finished, courseId);
        });
    });

})