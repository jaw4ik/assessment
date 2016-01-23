define(['synchronization/handlers/user/eventHandlers/upgradedToAcademy'], function (handler) {
    "use strict";

    var
        userContext = require('userContext'),
        app = require('durandal/app'),
        constants = require('constants')
    ;

    describe('synchronization user [upgradedToAcademy]', function () {

        beforeEach(function () {
            spyOn(app, 'trigger');
        });

        it('should be function', function () {
            expect(handler).toBeFunction();
        });

        describe('when user identity is not an object', function () {

            it('should throw an exception', function () {
                userContext.identity = undefined;

                var f = function () {
                    handler('2014-03-19T12:49:34.7396182Z');
                };

                expect(f).toThrow();
            });

        });

        it('should upgrade user to starter plan', function () {
            userContext.identity = jasmine.createSpyObj('identity', ['upgradeToAcademy']);
            handler('2014-03-19T12:49:34.7396182Z');
            expect(userContext.identity.upgradeToAcademy).toHaveBeenCalled();
        });


        it('should trigger \'user:upgradeToAcademy\' event', function () {
            userContext.identity = jasmine.createSpyObj('identity', ['upgradeToAcademy']);
            handler();
            expect(app.trigger).toHaveBeenCalledWith(constants.messages.user.upgradedToAcademy);
        });

        it('should trigger \'user:planChanged\' event', function () {
            userContext.identity = jasmine.createSpyObj('identity', ['upgradeToAcademy']);
            handler();
            expect(app.trigger).toHaveBeenCalledWith(constants.messages.user.planChanged);
        });

    });

})