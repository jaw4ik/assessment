define(['synchronization/handlers/collaboration/eventHandlers/collaboratorRegistered'], function (handler) {
    'use strict';

    var
        dataContext = require('dataContext'),
        app = require('durandal/app'),
        constants = require('constants');

    var courses = [
            { collaborators: [] },
            { collaborators: null },
            { collaborators: [{ email: 'email' }] }
    ];

    describe('synchronization collaboration [collaboratorRegistered]', function () {
        
        beforeEach(function () {
            dataContext.courses = courses;
            spyOn(app, 'trigger');
        });

        it('should be a function', function () {
            expect(handler).toBeFunction();
        });

        describe('when email is not string', function () {

            it('should throw exception', function () {
                var f = function () {
                    handler();
                };
                expect(f).toThrow('email is not a string');
            });

        });

        describe('when fullName is not string', function () {

            it('should throw exception', function () {
                var f = function () {
                    handler('email');
                };
                expect(f).toThrow('fullName is not a string');
            });

        });

        it('should trigger app event', function () {
            handler('email', 'fullName');

            expect(app.trigger).toHaveBeenCalledWith(constants.messages.course.collaboration.collaboratorRegistered + 'email', { fullName: 'fullName' });
        });

        it('should update collaborator for courses', function () {
            handler('email', 'fullName');

            expect(courses[2].collaborators[0].registered).toBeTruthy();
            expect(courses[2].collaborators[0].fullName).toBe('fullName');
        });

    });

});