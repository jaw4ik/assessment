define(['viewmodels/user/userMenu'], function (userMenu) {
    "use strict";

    var
        userContext = require('userContext'),
        eventTracker = require('eventTracker'),
        constants = require('constants'),
        router = require('plugins/router');

    describe('viewModel [userMenu]', function () {

        beforeEach(function () {
            spyOn(userContext, 'hasPlusAccess').and.returnValue(true);
        });

        describe('username:', function () {
            it('should be defined', function () {
                expect(userMenu.username).toBeDefined();
            });
        });

        describe('useremail:', function () {
            it('should be defined', function () {
                expect(userMenu.useremail).toBeDefined();
            });
        });

        describe('newEditor:', function () {
            it('should be defined', function () {
                expect(userMenu.newEditor).toBeDefined();
            });
        });

        describe('avatarLetter:', function () {
            it('should be defined', function () {
                expect(userMenu.avatarLetter).toBeDefined();
            });
        });

        describe('hasPlusAccess:', function () {
            it('should be observable', function () {
                expect(userMenu.hasPlusAccess).toBeObservable();
            });
        });

        describe('userPlanChanged', function () {
            it('should be function', function () {
                expect(userMenu.userPlanChanged).toBeFunction();
            });

            it('should call userContext hasPlusAccess', function () {
                userMenu.userPlanChanged();
                expect(userContext.hasPlusAccess).toHaveBeenCalled();
            });

            it('should set hasPlusAccess', function () {
                userMenu.hasPlusAccess(false);
                userMenu.userPlanChanged();
                expect(userMenu.hasPlusAccess()).toBeTruthy();
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

                it('should set useremail to null', function () {
                    userMenu.activate();
                    expect(userMenu.useremail).toBeNull();
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

            it('should set newEditor', function() {
                userMenu.newEditor(null);
                userMenu.activate({ newEditor: true });
                expect(userMenu.newEditor()).toBeTruthy();
            });

            it('should set switchEditor function', function () {
                var switchEditor = function() {};
                userMenu.activate({ switchEditor: switchEditor });
                expect(userMenu.switchEditor).toBe(switchEditor);
            });

            it('should set hasPlusAccess', function () {
                userMenu.hasPlusAccess(false);
                userMenu.activate();
                expect(userMenu.hasPlusAccess()).toBeTruthy();
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
                spyOn(router, 'setLocation');
                spyOn(window.auth, 'logout');
            });

            it('should be function', function () {
                expect(userMenu.signOut).toBeFunction();
            });

            it('should call logout', function () {
                userMenu.signOut();
                expect(window.auth.logout).toHaveBeenCalled();
            });

            it('should open signup page', function () {
                userMenu.signOut();
                expect(router.setLocation).toHaveBeenCalledWith(constants.signinUrl);
            });

        });

    });
})