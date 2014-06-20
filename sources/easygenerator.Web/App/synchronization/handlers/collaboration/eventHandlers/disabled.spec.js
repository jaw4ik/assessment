define(['synchronization/handlers/collaboration/eventHandlers/disabled'], function (handler) {
    "use strict";

    var
        dataContext = require('dataContext'),
        app = require('durandal/app'),
        constants = require('constants')
    ;

    describe('synchronization collaboration [disabled]', function () {

        var courseId = 'courseId',
            course = { id: courseId };

        beforeEach(function () {
            spyOn(app, 'trigger');
        });

        it('should be function', function () {
            expect(handler).toBeFunction();
        });

        describe('when courseIds is not an array', function () {
            it('should throw an exception', function () {
                var f = function () {
                    handler(undefined);
                };

                expect(f).toThrow('courseIds is not an array');
            });
        });

        it('should delete courses from data context', function () {
            dataContext.courses = [course];
            handler([courseId]);
            expect(dataContext.courses.length).toBe(0);
        });

        it('should trigger app event', function () {
            handler([courseId]);
            expect(app.trigger).toHaveBeenCalledWith(constants.messages.course.collaboration.disabled, [courseId]);
        });
    });

})