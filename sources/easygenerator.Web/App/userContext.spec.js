define(['userContext'], function (userContext) {

    var authHttpWrapper = require('http/authHttpWrapper');

    describe('[userContext]', function () {

        var
            app = require('durandal/app'),
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
                spyOn(authHttpWrapper, 'post').and.returnValue(ajax.promise());
                spyOn(app, 'trigger');
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

            it('should trigger event', function (done) {
                ajax.resolve({});

                userContext.identify().fin(function () {
                    expect(app.trigger).toHaveBeenCalledWith(constants.messages.user.identified, null);
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

            describe('when user has free subscription', function () {

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

            describe('when user has starter subscription', function () {

                var today = new Date();

                describe('and expiration date is null', function () {

                    beforeEach(function () {
                        userContext.identity = {
                            subscription: {
                                accessType: constants.accessType.starter,
                                expirationDate: null
                            }
                        };
                    });

                    it('should be false', function () {
                        expect(userContext.hasStarterAccess()).toBeFalsy();
                    });

                });

                describe('and expiration date has expired', function () {

                    var yesterday = new Date();
                    yesterday.setDate(today.getDate() - 1);

                    beforeEach(function () {
                        userContext.identity = {
                            subscription: {
                                accessType: constants.accessType.starter,
                                expirationDate: yesterday
                            }
                        };
                    });

                    it('should be false', function () {
                        expect(userContext.hasStarterAccess()).toBeFalsy();
                    });

                });

                describe('and expiration date has not yet expired', function () {

                    var tomorrow = new Date();
                    tomorrow.setDate(today.getDate() + 1);

                    beforeEach(function () {
                        userContext.identity = {
                            subscription: {
                                accessType: constants.accessType.starter,
                                expirationDate: tomorrow
                            }
                        };
                    });

                    it('should be true', function () {
                        expect(userContext.hasStarterAccess()).toBeTruthy();
                    });

                });

            });

            describe('when user has plus subscription', function () {
                var today = new Date();

                describe('and expiration date is null', function () {

                    beforeEach(function () {
                        userContext.identity = {
                            subscription: {
                                accessType: constants.accessType.plus,
                                expirationDate: null
                            }
                        };
                    });

                    it('should be false', function () {
                        expect(userContext.hasStarterAccess()).toBeFalsy();
                    });

                });

                describe('and expiration date has expired', function () {

                    var yesterday = new Date();
                    yesterday.setDate(today.getDate() - 1);

                    beforeEach(function () {
                        userContext.identity = {
                            subscription: {
                                accessType: constants.accessType.plus,
                                expirationDate: yesterday
                            }
                        };
                    });

                    it('should be false', function () {
                        expect(userContext.hasStarterAccess()).toBeFalsy();
                    });

                });

                describe('and expiration date has not yet expired', function () {

                    var tomorrow = new Date();
                    tomorrow.setDate(today.getDate() + 1);

                    beforeEach(function () {
                        userContext.identity = {
                            subscription: {
                                accessType: constants.accessType.plus,
                                expirationDate: tomorrow
                            }
                        };
                    });

                    it('should be true', function () {
                        expect(userContext.hasStarterAccess()).toBeTruthy();
                    });

                });
            });

        });

        describe('hasPlusAccess:', function () {

            it('should be function', function () {
                expect(userContext.hasPlusAccess).toBeFunction();
            });

            describe('when user identity is not an object', function () {

                beforeEach(function () {
                    userContext.identity = null;
                });

                it('should be false', function () {
                    expect(userContext.hasPlusAccess()).toBeFalsy();
                });

            });

            describe('when user identity subscription is not an object', function () {

                beforeEach(function () {
                    userContext.identity = {};
                });

                it('should be false', function () {
                    expect(userContext.hasPlusAccess()).toBeFalsy();
                });

            });

            describe('when user has free subscription', function () {

                beforeEach(function () {
                    userContext.identity = {
                        subscription: {
                            accessType: constants.accessType.free
                        }
                    };
                });

                it('should be false', function () {
                    expect(userContext.hasPlusAccess()).toBeFalsy();
                });

            });

            describe('when user has starter subscription', function () {

                beforeEach(function () {
                    var today = new Date(),
                        tomorrow = new Date();
                    tomorrow.setDate(today.getDate() + 1);

                    userContext.identity = {
                        subscription: {
                            accessType: constants.accessType.starter,
                            expirationDate: tomorrow
                        }
                    };
                });

                it('should be false', function () {
                    expect(userContext.hasPlusAccess()).toBeFalsy();
                });
            });

            describe('when user has plus subscription', function () {
                var today = new Date();

                describe('and expiration date is null', function () {

                    beforeEach(function () {
                        userContext.identity = {
                            subscription: {
                                accessType: constants.accessType.plus,
                                expirationDate: null
                            }
                        };
                    });

                    it('should be false', function () {
                        expect(userContext.hasPlusAccess()).toBeFalsy();
                    });

                });

                describe('and expiration date has expired', function () {

                    var yesterday = new Date();
                    yesterday.setDate(today.getDate() - 1);

                    beforeEach(function () {
                        userContext.identity = {
                            subscription: {
                                accessType: constants.accessType.plus,
                                expirationDate: yesterday
                            }
                        };
                    });

                    it('should be false', function () {
                        expect(userContext.hasPlusAccess()).toBeFalsy();
                    });

                });

                describe('and expiration date has not yet expired', function () {

                    var tomorrow = new Date();
                    tomorrow.setDate(today.getDate() + 1);

                    beforeEach(function () {
                        userContext.identity = {
                            subscription: {
                                accessType: constants.accessType.plus,
                                expirationDate: tomorrow
                            }
                        };
                    });

                    it('should be true', function () {
                        expect(userContext.hasPlusAccess()).toBeTruthy();
                    });

                });
            });

        });
    });

})