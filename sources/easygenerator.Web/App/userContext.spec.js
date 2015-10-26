define(['userContext'], function (userContext) {

    var authHttpWrapper = require('http/authHttpWrapper'),
        storageHttpWrapper = require('http/storageHttpWrapper'),
        notify = require('notify'),
        localizationManager = require('localization/localizationManager');

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
                    ajax.resolve({ email: 'user@easygenerator.com', subscription: { accessType: constants.accessType.free } });

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

        describe('identifyStoragePermissions:', function () {

            var ajax;

            beforeEach(function () {
                ajax = $.Deferred();
                spyOn(storageHttpWrapper, 'get').and.returnValue(ajax.promise());
                spyOn(notify, 'error');
            });

            it('should be function', function () {
                expect(userContext.identifyStoragePermissions).toBeFunction();
            });

            it('should return promise', function () {
                expect(userContext.identifyStoragePermissions()).toBePromise();
            });

            describe('when an error occured while getting user', function () {

                beforeEach(function (done) {
                    ajax.reject();
                    done();
                });

                it('should reject promise', function (done) {
                    var promise = userContext.identifyStoragePermissions();

                    promise.fail(function () {
                        done();
                    }).done();
                });

                it('should show notification error', function (done) {
                    var promise = userContext.identifyStoragePermissions();

                    promise.fail(function () {
                        done();
                    }).done();

                    expect(notify.error).toHaveBeenCalledWith(localizationManager.localize('storageFailed'));
                });

                it('should set availableStorageSpace to zero', function (done) {
                    userContext.storageIdentity = {};

                    var promise = userContext.identifyStoragePermissions();

                    promise.fail(function () {
                        done();
                    }).done();

                    expect(userContext.storageIdentity.availableStorageSpace).toBe(0);
                });

                it('should set totalStorageSpace to zero', function (done) {
                    userContext.storageIdentity = {};

                    var promise = userContext.identifyStoragePermissions();

                    promise.fail(function () {
                        done();
                    }).done();

                    expect(userContext.storageIdentity.totalStorageSpace).toBe(0);
                });

            });

            it('should resolve promise', function (done) {
                ajax.resolve({ AvailableStorageSpace: 10, TotalStorageSpace: 100 });

                var promise = userContext.identifyStoragePermissions();
                promise.fin(function () {
                    expect(promise).toBeResolved();
                    done();
                }).done();
            });

            it('should set availableStorageSpace', function (done) {
                userContext.storageIdentity = {};
                userContext.storageIdentity.availableStorageSpace = 0;

                ajax.resolve({ AvailableStorageSpace: 10, TotalStorageSpace: 100 });

                var promise = userContext.identifyStoragePermissions();
                promise.fin(function () {
                    expect(promise).toBeResolved();
                    done();
                }).done();

                expect(userContext.storageIdentity.availableStorageSpace).toBe(10);
            });

            it('should set totalStorageSpace', function (done) {
                userContext.storageIdentity = {};
                userContext.storageIdentity.totalStorageSpace = 0;

                ajax.resolve({ AvailableStorageSpace: 10, TotalStorageSpace: 100 });

                var promise = userContext.identifyStoragePermissions();
                promise.fin(function () {
                    expect(promise).toBeResolved();
                    done();
                }).done();

                expect(userContext.storageIdentity.totalStorageSpace).toBe(100);
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

            describe('when user has trial subscription', function () {
                var today = new Date();

                describe('and expiration date is null', function () {

                    beforeEach(function () {
                        userContext.identity = {
                            subscription: {
                                accessType: constants.accessType.trial,
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
                                accessType: constants.accessType.trial,
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
                                accessType: constants.accessType.trial,
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

            describe('when user has trial subscription', function () {
                var today = new Date();

                describe('and expiration date is null', function () {

                    beforeEach(function () {
                        userContext.identity = {
                            subscription: {
                                accessType: constants.accessType.trial,
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
                                accessType: constants.accessType.trial,
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
                                accessType: constants.accessType.trial,
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

        describe('hasAcademyAccess:', function () {

            it('should be function', function () {
                expect(userContext.hasAcademyAccess).toBeFunction();
            });

            describe('when user identity is not an object', function () {

                beforeEach(function () {
                    userContext.identity = null;
                });

                it('should be false', function () {
                    expect(userContext.hasAcademyAccess()).toBeFalsy();
                });

            });

            describe('when user identity subscription is not an object', function () {

                beforeEach(function () {
                    userContext.identity = {};
                });

                it('should be false', function () {
                    expect(userContext.hasAcademyAccess()).toBeFalsy();
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
                    expect(userContext.hasAcademyAccess()).toBeFalsy();
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
                    expect(userContext.hasAcademyAccess()).toBeFalsy();
                });
            });

            describe('when user has plus subscription', function () {

                beforeEach(function () {
                    var today = new Date(),
                        tomorrow = new Date();
                    tomorrow.setDate(today.getDate() + 1);

                    userContext.identity = {
                        subscription: {
                            accessType: constants.accessType.plus,
                            expirationDate: tomorrow
                        }
                    };
                });

                it('should be false', function () {
                    expect(userContext.hasAcademyAccess()).toBeFalsy();
                });
            });

            describe('when user has academy subscription', function () {
                var today = new Date();

                describe('and expiration date is null', function () {

                    beforeEach(function () {
                        userContext.identity = {
                            subscription: {
                                accessType: constants.accessType.academy,
                                expirationDate: null
                            }
                        };
                    });

                    it('should be false', function () {
                        expect(userContext.hasAcademyAccess()).toBeFalsy();
                    });

                });

                describe('and expiration date has expired', function () {

                    var yesterday = new Date();
                    yesterday.setDate(today.getDate() - 1);

                    beforeEach(function () {
                        userContext.identity = {
                            subscription: {
                                accessType: constants.accessType.academy,
                                expirationDate: yesterday
                            }
                        };
                    });

                    it('should be false', function () {
                        expect(userContext.hasAcademyAccess()).toBeFalsy();
                    });

                });

                describe('and expiration date has not yet expired', function () {

                    var tomorrow = new Date();
                    tomorrow.setDate(today.getDate() + 1);

                    beforeEach(function () {
                        userContext.identity = {
                            subscription: {
                                accessType: constants.accessType.academy,
                                expirationDate: tomorrow
                            }
                        };
                    });

                    it('should be true', function () {
                        expect(userContext.hasAcademyAccess()).toBeTruthy();
                    });

                });
            });

            describe('when user has trial subscription', function () {
                var today = new Date();

                describe('and expiration date is null', function () {

                    beforeEach(function () {
                        userContext.identity = {
                            subscription: {
                                accessType: constants.accessType.trial,
                                expirationDate: null
                            }
                        };
                    });

                    it('should be false', function () {
                        expect(userContext.hasAcademyAccess()).toBeFalsy();
                    });

                });

                describe('and expiration date has expired', function () {

                    var yesterday = new Date();
                    yesterday.setDate(today.getDate() - 1);

                    beforeEach(function () {
                        userContext.identity = {
                            subscription: {
                                accessType: constants.accessType.trial,
                                expirationDate: yesterday
                            }
                        };
                    });

                    it('should be false', function () {
                        expect(userContext.hasAcademyAccess()).toBeFalsy();
                    });

                });

                describe('and expiration date has not yet expired', function () {

                    var tomorrow = new Date();
                    tomorrow.setDate(today.getDate() + 1);

                    beforeEach(function () {
                        userContext.identity = {
                            subscription: {
                                accessType: constants.accessType.trial,
                                expirationDate: tomorrow
                            }
                        };
                    });

                    it('should be true', function () {
                        expect(userContext.hasAcademyAccess()).toBeTruthy();
                    });

                });
            });

        });

        describe('hasTrialAccess:', function () {

            it('should be function', function () {
                expect(userContext.hasTrialAccess).toBeFunction();
            });

            describe('when user identity is not an object', function () {

                beforeEach(function () {
                    userContext.identity = null;
                });

                it('should be false', function () {
                    expect(userContext.hasTrialAccess()).toBeFalsy();
                });

            });

            describe('when user identity subscription is not an object', function () {

                beforeEach(function () {
                    userContext.identity = {};
                });

                it('should be false', function () {
                    expect(userContext.hasTrialAccess()).toBeFalsy();
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
                    expect(userContext.hasTrialAccess()).toBeFalsy();
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
                    expect(userContext.hasTrialAccess()).toBeFalsy();
                });
            });

            describe('when user has plus subscription', function () {

                beforeEach(function () {
                    var today = new Date(),
                        tomorrow = new Date();
                    tomorrow.setDate(today.getDate() + 1);

                    userContext.identity = {
                        subscription: {
                            accessType: constants.accessType.plus,
                            expirationDate: tomorrow
                        }
                    };
                });

                it('should be false', function () {
                    expect(userContext.hasTrialAccess()).toBeFalsy();
                });
            });

            describe('when user has trial subscription', function () {
                var today = new Date();

                describe('and expiration date is null', function () {

                    beforeEach(function () {
                        userContext.identity = {
                            subscription: {
                                accessType: constants.accessType.trial,
                                expirationDate: null
                            }
                        };
                    });

                    it('should be false', function () {
                        expect(userContext.hasTrialAccess()).toBeFalsy();
                    });

                });

                describe('and expiration date has expired', function () {

                    var yesterday = new Date();
                    yesterday.setDate(today.getDate() - 1);

                    beforeEach(function () {
                        userContext.identity = {
                            subscription: {
                                accessType: constants.accessType.trial,
                                expirationDate: yesterday
                            }
                        };
                    });

                    it('should be false', function () {
                        expect(userContext.hasTrialAccess()).toBeFalsy();
                    });

                });

                describe('and expiration date has not yet expired', function () {

                    var tomorrow = new Date();
                    tomorrow.setDate(today.getDate() + 1);

                    beforeEach(function () {
                        userContext.identity = {
                            subscription: {
                                accessType: constants.accessType.trial,
                                expirationDate: tomorrow
                            }
                        };
                    });

                    it('should be true', function () {
                        expect(userContext.hasTrialAccess()).toBeTruthy();
                    });

                });
            });
        });
    });

})