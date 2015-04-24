define(['synchronization/handlers/collaboration/eventHandlers/collaboratorRemoved'], function (handler) {
    "use strict";

    var
        dataContext = require('dataContext'),
        app = require('durandal/app'),
        constants = require('constants')
    ;

    describe('synchronization collaboration [collaboratorRemoved]', function () {

        var courseId = 'courseId',
            collaboratorEmail = 'collaboratorEmail',
            mappedCourse = { id: courseId, collaborators: [] };

        beforeEach(function () {
            spyOn(app, 'trigger');
        });

        it('should be function', function () {
            expect(handler).toBeFunction();
        });

        describe('when courseId is not a string', function () {
            it('should throw an exception', function () {
                var f = function () {
                    handler(undefined, collaboratorEmail);
                };

                expect(f).toThrow('courseId is not a string');
            });
        });

        describe('when collaboratorId is not a string', function () {
            it('should throw an exception', function () {
                var f = function () {
                    handler(courseId, undefined);
                };

                expect(f).toThrow('collaboratorEmail is not a string');
            });
        });

        describe('when course is found in dataContext', function () {

            it('should throw an exception', function () {
                dataContext.courses = [];
                var f = function () {
                    handler(courseId, collaboratorEmail);
                };

                expect(f).toThrow('Course is not an object');
            });

        });

        describe('when course collaborators are loaded', function () {
            it('should remove collaborator from collaborators collection', function () {
                dataContext.courses = [mappedCourse];
                mappedCourse.collaborators = [{ email: collaboratorEmail }];
                handler(courseId, collaboratorEmail);
                expect(mappedCourse.collaborators.length).toBe(0);
            });
        });

        it('should trigger app event', function () {
            dataContext.courses = [mappedCourse];
            handler(courseId, collaboratorEmail);
            expect(app.trigger).toHaveBeenCalledWith(constants.messages.course.collaboration.collaboratorRemoved + courseId, collaboratorEmail);
        });
    });

})