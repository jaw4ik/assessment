define(['synchronization/handlers/userUpgradedToStarter'], function (handler) {

    var
        userContext = require('userContext')
    ;

    describe('synchronization [userUpgradedToStarter]', function () {

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
            userContext.identity.subscription = { accessType: 1 }; // to remove errors from task scheduler in tests
            handler('2014-03-19T12:49:34.7396182Z');
            expect(userContext.identity.upgradeToStarter).toHaveBeenCalled();
        });

    });

})