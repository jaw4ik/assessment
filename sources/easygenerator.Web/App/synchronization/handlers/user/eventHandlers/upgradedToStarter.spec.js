define(['synchronization/handlers/user/eventHandlers/upgradedToStarter'], function (handler) {

    var
        userContext = require('userContext'),
        app = require('durandal/app'),
        constants = require('constants')
    ;

    describe('synchronization user [upgradedToStarter]', function () {

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
            userContext.identity = jasmine.createSpyObj('identity', ['upgradeToStarter']);
            handler('2014-03-19T12:49:34.7396182Z');
            expect(userContext.identity.upgradeToStarter).toHaveBeenCalled();
        });


        it('should trigger \'user:upgraded\' event', function () {
            userContext.identity = jasmine.createSpyObj('identity', ['upgradeToStarter']);
            handler();
            expect(app.trigger).toHaveBeenCalledWith(constants.messages.user.upgradedToStarter);
        });

        it('should trigger \'user:planChanged\' event', function () {
            userContext.identity = jasmine.createSpyObj('identity', ['upgradeToStarter']);
            handler();
            expect(app.trigger).toHaveBeenCalledWith(constants.messages.user.planChanged);
        });

    });

})