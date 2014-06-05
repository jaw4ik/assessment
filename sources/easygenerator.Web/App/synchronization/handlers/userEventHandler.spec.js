define(['synchronization/handlers/userEventHandler'], function (handler) {

    var
        userContext = require('userContext'),
        app = require('durandal/app'),
        constants = require('constants')
    ;

    describe('synchronization [userEventHandler]', function () {

        beforeEach(function () {
            spyOn(app, 'trigger');
        });

        describe('userUpgradedToStarter:', function () {
            
            it('should be function', function () {
                expect(handler.userUpgradedToStarter).toBeFunction();
            });

            describe('when user identity is not an object', function () {

                it('should throw an exception', function () {
                    userContext.identity = undefined;

                    var f = function () {
                        handler.userUpgradedToStarter('2014-03-19T12:49:34.7396182Z');
                    };

                    expect(f).toThrow();
                });

            });

            it('should upgrade user to starter plan', function () {
                userContext.identity = jasmine.createSpyObj('identity', ['upgradeToStarter']);
                handler.userUpgradedToStarter('2014-03-19T12:49:34.7396182Z');
                expect(userContext.identity.upgradeToStarter).toHaveBeenCalled();
            });


            it('should trigger \'user:upgraded\' event', function () {
                userContext.identity = jasmine.createSpyObj('identity', ['upgradeToStarter']);
                handler.userUpgradedToStarter();
                expect(app.trigger).toHaveBeenCalledWith(constants.messages.user.upgraded);
            });

        });

        describe('userDowngraded:', function() {
            
            it('should be function', function () {
                expect(handler.userDowngraded).toBeFunction();
            });

            describe('when user identity is not an object', function () {

                it('should throw an exception', function () {
                    userContext.identity = undefined;

                    var f = function () {
                        handler.userDowngraded();
                    };

                    expect(f).toThrow();
                });

            });

            it('should downgrade user', function () {
                userContext.identity = jasmine.createSpyObj('identity', ['downgrade']);
                handler.userDowngraded();
                expect(userContext.identity.downgrade).toHaveBeenCalled();
            });

            it('should trigger \'user:downgraded\' event', function () {
                userContext.identity = jasmine.createSpyObj('identity', ['downgrade']);
                handler.userDowngraded();
                expect(app.trigger).toHaveBeenCalledWith(constants.messages.user.downgraded);
            });

        });

    });

})