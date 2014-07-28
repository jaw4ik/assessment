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

        it('should delete not used objectives from data context', function () {
            var objective = { id: 'objId' },
                objective2 = { id: 'objId2' },
                objective3 = { id: 'obj3' };

            dataContext.objectives = [objective, objective2, objective3];
            course.objectives = [objective, objective2, objective3];
            var course2 = { objectives: [objective] };
            dataContext.courses = [course, course2];

            handler(courseId);
            expect(dataContext.objectives.length).toBe(1);
            expect(dataContext.objectives[0].id).toBe(objective.id);
        });

        it('should trigger app event', function () {
            handler(courseId);
            expect(app.trigger).toHaveBeenCalledWith(constants.messages.course.collaboration.finished, courseId);
        });
    });

})