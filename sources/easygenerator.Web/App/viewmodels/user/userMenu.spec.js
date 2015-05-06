define(['viewmodels/user/userMenu'], function (userMenu) {
    "use strict";

    var
        userContext = require('userContext'),
        eventTracker = require('eventTracker'),
        constants = require('constants'),
        router = require('plugins/router');

    describe('viewModel [userMenu]', function () {

        beforeEach(function () {
            spyOn(userContext, 'hasStarterAccess').and.returnValue(true);
        });

        describe('username:', function () {
            it('should be defined', function () {
                expect(userMenu.username).toBeDefined();
            });
        });

        describe('avatarLetter:', function () {
            it('should be defined', function () {
                expect(userMenu.avatarLetter).toBeDefined();
            });
        });

        describe('hasStarterAccess:', function () {
            it('should be observable', function () {
                expect(userMenu.hasStarterAccess).toBeObservable();
            });
        });

        describe('userPlanChanged', function () {
            it('should be function', function () {
                expect(userMenu.userPlanChanged).toBeFunction();
            });

            it('should call userContext hasStartedAccess', function () {
                userMenu.userPlanChanged();
                expect(userContext.hasStarterAccess).toHaveBeenCalled();
            });

            it('should set hasStarterAccess', function () {
                userMenu.hasStarterAccess(false);
                userMenu.userPlanChanged();
                expect(userMenu.hasStarterAccess()).toBeTruthy();
            });
        });

        describe('activate:', function () {
            it('should be function', function () {
                expect(userMenu.activate).toBeFunction();
            });

            describe('when user is anonymous', function () {

                beforeEach(function () {
                    userContext.identity = null;
                });

                it('should set username to null', function () {
                    userMenu.activate();
                    expect(userMenu.username).toBeNull();
                });

                it('should set avatarLetter to null', function () {
                    userMenu.activate();
                    expect(userMenu.avatarLetter).toBeNull();
                });

            });

            describe('when user is not anonymous', function () {

                describe('and user does not have fullname', function () {
                    var email = 'usermail@easygenerator.com';
                    beforeEach(function () {
                        userContext.identity = {
                            email: email,
                            fullname: ' '
                        };
                    });

                    it('should set email to username', function () {
                        userMenu.activate();
                        expect(userMenu.username).toBe(userContext.identity.email);
                    });

                    it('should set avatarLetter to first email letter', function () {
                        userMenu.avatarLetter = null;
                        userMenu.activate();
                        expect(userMenu.avatarLetter).toBe(email.charAt(0));
                    });
                });

                describe('and user has fullname', function () {
                    var fullName = 'username';
                    beforeEach(function () {
                        userContext.identity = { fullname: fullName };
                    });

                    it('should set fullname to username', function () {
                        userMenu.activate();
                        expect(userMenu.username).toBe(userContext.identity.fullname);
                    });

                    it('should set avatarLetter to first fullName letter', function () {
                        userMenu.avatarLetter = null;
                        userMenu.activate();
                        expect(userMenu.avatarLetter).toBe(fullName.charAt(0));
                    });

                });

            });

            it('should set hasStarterAccess', function () {
                userMenu.hasStarterAccess(false);
                userMenu.activate();
                expect(userMenu.hasStarterAccess()).toBeTruthy();
            });
        });

        describe('openUpgradePlanUrl:', function () {

            beforeEach(function () {
                spyOn(eventTracker, 'publish');
                spyOn(window, 'open');
            });

            it('should be function', function () {
                expect(userMenu.openUpgradePlanUrl).toBeFunction();
            });

            it('should send event \'Upgrade now\'', function () {
                userMenu.openUpgradePlanUrl();
                expect(eventTracker.publish).toHaveBeenCalledWith(constants.upgradeEvent, constants.upgradeCategory.userMenuInHeader);
            });

            it('should open upgrade link in new window', function () {
                userMenu.openUpgradePlanUrl();
                expect(window.open).toHaveBeenCalledWith(constants.upgradeUrl, '_blank');
            });

        });

        describe('signOut:', function () {

            var storage;
            var length;

            beforeEach(function () {
                storage = {
                    'key': 'value',
                    'token-key': 'value',
                    'token-auth': 'value',
                    'token-api': 'value',
                    'key-token': 'value',
                    'tokenkey': 'value',
                    'toke-nkey': 'value'
                };
                length = 7;

                spyOn(router, 'openUrl');
                spyOn(localStorage, 'getItem').and.callFake(function () {
                    return storage[key];
                });
                spyOn(localStorage, 'removeItem').and.callFake(function () {
                    length--;
                    delete storage[key];
                });
                spyOn(localStorage, 'key').and.callFake(function () {
                    return storage[index];
                });
            });

            it('should be function', function () {
                expect(userMenu.signOut).toBeFunction();
            });

            //it('should remove token-key', function () {
            //    userMenu.signOut();
            //    expect(localStorage.removeItem).toHaveBeenCalledWith('token-key');
            //});

            it('should open signup page', function () {
                userMenu.signOut();
                expect(router.openUrl).toHaveBeenCalledWith(constants.signinUrl);
            });

        });

    });
})