define(['synchronization/handlers/user/eventHandlers/upgradedToPlus'], function (handler) {
    "use strict";

    var
        userContext = require('userContext'),
        app = require('durandal/app'),
        constants = require('constants')
    ;

    describe('synchronization user [upgradedToPlus]', function () {

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
            userContext.identity = jasmine.createSpyObj('identity', ['upgradeToPlus']);
            handler('2014-03-19T12:49:34.7396182Z');
            expect(userContext.identity.upgradeToPlus).toHaveBeenCalled();
        });


        it('should trigger \'user:upgradeToPlus\' event', function () {
            userContext.identity = jasmine.createSpyObj('identity', ['upgradeToPlus']);
            handler();
            expect(app.trigger).toHaveBeenCalledWith(constants.messages.user.upgradedToPlus);
        });

        it('should trigger \'user:planChanged\' event', function () {
            userContext.identity = jasmine.createSpyObj('identity', ['upgradeToPlus']);
            handler();
            expect(app.trigger).toHaveBeenCalledWith(constants.messages.user.planChanged);
        });

    });

})