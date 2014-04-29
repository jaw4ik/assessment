define(['viewmodels/user/userMenu'], function (userMenu) {
    "use strict";

    var
        userContext = require('userContext')
    ;

    describe('viewModel [userMenu]', function () {

        beforeEach(function () {
            spyOn(userContext, 'hasStarterAccess').and.returnValue(true);
        });

        describe('username:', function () {
            it('should be defined', function () {
                expect(userMenu.username).toBeDefined();
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

            });

            describe('when user is not anonymous', function () {

                describe('and user does not have fullname', function () {

                    beforeEach(function () {
                        userContext.identity = {
                            email: 'usermail@easygenerator.com',
                            fullname: ' '
                        };
                    });

                    it('should set email to username', function () {
                        userMenu.activate();
                        expect(userMenu.username).toBe(userContext.identity.email);
                    });

                });

                describe('and user has fullname', function () {

                    beforeEach(function () {
                        userContext.identity = { fullname: 'username' };
                    });

                    it('should set fullname to username', function () {
                        userMenu.activate();
                        expect(userMenu.username).toBe(userContext.identity.fullname);
                    });

                });

            });

            it('should set hasStarterAccess', function () {
                userMenu.hasStarterAccess(false);
                userMenu.activate();
                expect(userMenu.hasStarterAccess()).toBeTruthy();
            });
        });

    });
})