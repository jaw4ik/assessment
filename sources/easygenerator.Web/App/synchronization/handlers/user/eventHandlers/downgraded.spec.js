define(['synchronization/handlers/user/eventHandlers/downgraded'], function (handler) {

    var
        userContext = require('userContext'),
        app = require('durandal/app'),
        constants = require('constants')
    ;

    describe('synchronization user [downgraded]', function () {

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
                    handler();
                };

                expect(f).toThrow();
            });

        });

        it('should downgrade user', function () {
            userContext.identity = jasmine.createSpyObj('identity', ['downgrade']);
            handler();
            expect(userContext.identity.downgrade).toHaveBeenCalled();
        });

        it('should trigger \'user:downgraded\' event', function () {
            userContext.identity = jasmine.createSpyObj('identity', ['downgrade']);
            handler();
            expect(app.trigger).toHaveBeenCalledWith(constants.messages.user.downgraded);
        });

        it('should trigger \'user:planChanged\' event', function () {
            userContext.identity = jasmine.createSpyObj('identity', ['downgrade']);
            handler();
            expect(app.trigger).toHaveBeenCalledWith(constants.messages.user.planChanged);
        });

    });

});