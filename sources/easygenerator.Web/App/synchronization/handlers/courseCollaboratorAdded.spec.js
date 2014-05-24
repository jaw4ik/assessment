define(['synchronization/handlers//courseCollaboratorAdded'], function (handler) {
    "use strict";

    var
        dataContext = require('dataContext'),
        app = require('durandal/app'),
        collaboratorModelMapper = require('mappers/collaboratorModelMapper')
    ;

    describe('synchronization [courseCollaboratorAdded]', function () {

        var courseId = 'courseId',
            user = { Email: 'mail', FullName: 'fullName' };

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
                    handler(courseId, undefined);
                };

                expect(f).toThrow('User is not an object');
            });
        });

        describe('when course is found in dataContext', function () {

            it('should throw an exception', function () {
                dataContext.courses = [];
                var f = function () {
                    handler(courseId, user);
                };

                expect(f).toThrow('Course is not an object');
            });

        });

        it('should add collaborator to course in data context', function () {
            var course = { id: courseId, collaborators: [] };
            dataContext.courses = [course];
            handler(courseId, user);

            expect(dataContext.courses[0].collaborators.length).toBe(1);
        });

        it('should trigger app event', function () {
            handler(courseId, user);
            expect(app.trigger).toHaveBeenCalled();
        });

    });

})