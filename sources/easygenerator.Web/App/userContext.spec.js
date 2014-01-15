define(['userContext'], function (userContext) {

    describe('[userContext]', function () {

        var
            constants = require('constants')
        ;

        it('should be object', function () {
            expect(userContext).toBeObject();
        });

        describe('identity:', function () {

            it('should be defined', function () {
                expect(userContext.identity).toBeDefined();
            });

        });

        describe('initialize:', function () {

            var ajax;

            beforeEach(function () {
                ajax = $.Deferred();
                spyOn($, 'ajax').andReturn(ajax.promise());
            });

            it('should be function', function () {
                expect(userContext.initialize).toBeFunction();
            });

            it('should return promise', function () {
                expect(userContext.initialize()).toBePromise();
            });

            describe('when an error occured while getting user', function () {

                beforeEach(function () {
                    ajax.reject();
                });

                it('should reject promise', function () {
                    var promise = userContext.initialize();

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(promise).toBeRejected();
                    });
                });

            });

            describe('when user has access level 0', function () {

                it('should set a free user identity', function () {

                    var user = {
                        username: 'username',
                        email: 'user@easygenerator.com',
                        accessType: 0
                    };

                    ajax.resolve(user);

                    var promise = userContext.initialize();

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(userContext.identity).toEqual({
                            username: user.username,
                            email: user.email,
                            accessType: constants.accessType.free
                        });
                    });
                });

            });

            describe('when user has access level 1', function () {

                it('should set a starter user identity', function () {

                    var user = {
                        username: 'username',
                        email: 'user@easygenerator.com',
                        accessType: 1
                    };

                    ajax.resolve(user);

                    var promise = userContext.initialize();

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(userContext.identity).toEqual({
                            username: user.username,
                            email: user.email,
                            accessType: constants.accessType.starter
                        });
                    });
                });

            });

            it('should resolve promise', function () {
                var promise = userContext.initialize();
                ajax.resolve({});

                waitsFor(function () {
                    return !promise.isPending();
                });
                runs(function () {
                    expect(promise).toBeResolved();
                });
            });

        });

        describe('hasStarterAccess:', function () {

            it('should be function', function () {
                expect(userContext.hasStarterAccess).toBeFunction();
            });

            describe('when user identity is not an object', function () {

                beforeEach(function () {
                    userContext.identity = null;
                });

                it('should be false', function () {
                    expect(userContext.hasStarterAccess()).toBeFalsy();
                });

            });

            describe('when user has free access type', function () {

                beforeEach(function () {
                    userContext.identity = { accessType: constants.accessType.free };
                });

                it('should be false', function () {
                    expect(userContext.hasStarterAccess()).toBeFalsy();
                });

            });

            describe('when user has starter access type', function () {

                beforeEach(function () {
                    userContext.identity = { accessType: constants.accessType.starter };
                });

                it('should be false', function () {
                    expect(userContext.hasStarterAccess()).toBeTruthy();
                });

            });

        });
    });

})