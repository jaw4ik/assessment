define(['synchronization/handlers/course/eventHandlers/changed'], function (handler) {
    "use strict";

    var
        dataContext = require('dataContext'),
        app = require('durandal/app'),
        constants = require('constants')
    ;

    describe('synchronization course [changed]', function () {

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

        describe('when course is not found in data context', function () {
            it('should throw an exception', function () {
                dataContext.courses = [];

                var f = function () {
                    handler(mappedCourse.id);
                };

                expect(f).toThrow('Course has not been found');
            });
        });

        describe('when course already has unpublished changes', function () {
            beforeEach(function () {
                mappedCourse.hasUnpublishedChanges = true;
                dataContext.courses = [mappedCourse];
            });

            it('should not update hasUnpublishedChanges', function () {
                handler(mappedCourse.id);

                expect(dataContext.courses[0].hasUnpublishedChanges).toBeTruthy();
            });

            it('should not trigger app event', function () {
                handler(mappedCourse.id);
                expect(app.trigger).not.toHaveBeenCalled();
            });
        });

        describe('when course doesn\'t have unpublished changes', function () {
            beforeEach(function () {
                mappedCourse.hasUnpublishedChanges = false;
                dataContext.courses = [mappedCourse];
            });

            it('should set hasUnpublishedChanges to true', function () {
                handler(mappedCourse.id);

                expect(dataContext.courses[0].hasUnpublishedChanges).toBeTruthy();
            });

            it('should trigger app event', function () {
                handler(mappedCourse.id);
                expect(app.trigger).toHaveBeenCalledWith(constants.messages.course.changed + mappedCourse.id);
            });
        });
    });

})