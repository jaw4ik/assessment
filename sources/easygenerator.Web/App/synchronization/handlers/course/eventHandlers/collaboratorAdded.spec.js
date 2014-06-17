define(['synchronization/handlers/course/eventHandlers/collaboratorAdded'], function (handler) {
    "use strict";

    var
        dataContext = require('dataContext'),
        app = require('durandal/app'),
        collaboratorModelMapper = require('mappers/collaboratorModelMapper')
    ;

    describe('synchronization course [collaboratorAdded]', function () {

        var course = { Id: 'courseId' },
            user = { Email: 'mail', FullName: 'fullName' },
            mappedCourse = { id: course.Id, collaborators: [] };

        beforeEach(function () {
            spyOn(app, 'trigger');
            spyOn(collaboratorModelMapper, 'map');
        });


        it('should be function', function () {
            expect(handler).toBeFunction();
        });

        describe('when courseId is not a string', function () {
            it('should throw an exception', function () {
                var f = function () {
                    handler(undefined, user);
                };

                expect(f).toThrow('courseId is not a string');
            });
        });

        describe('when user is not an object', function () {
            it('should throw an exception', function () {
                var f = function () {
                    handler(course.Id, undefined);
                };

                expect(f).toThrow('User is not an object');
            });
        });

        describe('when course is found in dataContext', function () {

            it('should throw an exception', function () {
                dataContext.courses = [];
                var f = function () {
                    handler(course.Id, user);
                };

                expect(f).toThrow('Course is not an object');
            });

        });

        it('should trigger app event', function () {
            dataContext.courses = [mappedCourse];
            handler(course.Id, user);
            expect(app.trigger).toHaveBeenCalled();
        });
    });

})