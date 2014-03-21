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

        describe('identify:', function () {

            var ajax;

            beforeEach(function () {
                ajax = $.Deferred();
                spyOn($, 'ajax').and.returnValue(ajax.promise());
            });

            it('should be function', function () {
                expect(userContext.identify).toBeFunction();
            });

            it('should return promise', function () {
                expect(userContext.identify()).toBePromise();
            });

            describe('when an error occured while getting user', function () {

                beforeEach(function (done) {
                    ajax.reject();
                    done();
                });

                it('should reject promise', function (done) {
                    var promise = userContext.identify();

                    promise.fail(function () {                        
                        done();
                    }).done();
                });

            });

            describe('when user email is not a string', function () {

                it('should set a null identity', function (done) {
                    ajax.resolve({});

                    userContext.identify().fin(function () {
                        expect(userContext.identity).toEqual(null);
                        done();
                    }).done();
                });

            });

            describe('when user email is a string', function () {

                it('should set user identity', function (done) {
                    ajax.resolve({ email: 'user@easygenerator.com', subscription: { accessType: 0 } });

                    userContext.identify().fin(function () {
                        expect(userContext.identity.__moduleId__).toEqual("models/user");
                        done();
                    }).done();
                });

            });

            it('should resolve promise', function (done) {
                ajax.resolve({});

                var promise = userContext.identify();
                promise.fin(function () {
                    expect(promise).toBeResolved();
                    done();
                }).done();
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

            describe('when user identity subscription is not an object', function () {

                beforeEach(function () {
                    userContext.identity = {};
                });

                it('should be false', function () {
                    expect(userContext.hasStarterAccess()).toBeFalsy();
                });

            });

            describe('when user has free access type', function () {

                beforeEach(function () {
                    userContext.identity = {
                        subscription: {
                            accessType: constants.accessType.free
                        }
                    };
                });

                it('should be false', function () {
                    expect(userContext.hasStarterAccess()).toBeFalsy();
                });

            });

            describe('when user has starter access type', function () {

                beforeEach(function () {
                    userContext.identity = {
                        subscription: {
                            accessType: constants.accessType.starter
                        }
                    };
                });

                it('should be false', function () {
                    expect(userContext.hasStarterAccess()).toBeTruthy();
                });

            });

        });

    });

})