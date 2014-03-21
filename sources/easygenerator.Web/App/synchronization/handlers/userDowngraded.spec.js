define(['synchronization/handlers/userDowngraded'], function(handler) {
    var
        userContext = require('userContext')
    ;

    describe('synchronization [userDowngraded]', function () {

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

    });
})