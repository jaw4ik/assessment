import userContext from 'userContext';

import app from 'durandal/app';
import constants from 'constants';
import authHttpWrapper from 'http/authHttpWrapper';
import storageHttpWrapper from 'http/storageHttpWrapper';
import notify from 'notify';
import localizationManager from 'localization/localizationManager';

describe('[userContext]', () => {

    describe('identity:', () => {

        it('should be defined', () => {
            expect(userContext.identity).toBeDefined();
        });

    });

    describe('identify:', () => {

        let authHttpWrapperPromise;
        let user;
        beforeEach(() => {
            user = { email: 'user@email.com', subscription: { accessType: 0 }, companies: [{ Id: 'companyId', HideDefaultPublishOptions: true }, { Id: 'company2Id' }] };
            authHttpWrapperPromise = Promise.resolve(user);
            spyOn(authHttpWrapper, 'post').and.returnValue(authHttpWrapperPromise);
            spyOn(app, 'trigger');
        });

        it('should be function', () => {
            expect(userContext.identify).toBeFunction();
        });

        it('should return promise', () => {
            expect(userContext.identify()).toBePromise();
        });

        it('should set identity', done => (async () => {
            userContext.identity = null;
            userContext.identify();
            await authHttpWrapperPromise;
            expect(userContext.identity).toBeObject();
        })().then(done));

        it('should trigger event', done => (async () => {
            userContext.identify();
            await authHttpWrapperPromise;
            expect(app.trigger).toHaveBeenCalledWith(constants.messages.user.identified, userContext.identity);
        })().then(done));

        describe('when company provided by LTI exists', () => {

            describe('and company has an option to hide default publish options', () => {

                beforeEach(() => {
                    userContext.ltiData.companyId = 'companyId';
                });

                it('should set only this company to company list', done => (async () => {
                    userContext.identify();
                    await authHttpWrapperPromise;
                    expect(userContext.identity.companies.length).toBe(1);
                    expect(userContext.identity.companies[0].id).toBe('companyId');
                })().then(done));

            });

        });

    });

    describe('identifyStoragePermissions:', () => {

        let storageHttpWrapperDefer;
        beforeEach(() => {
            storageHttpWrapperDefer = Q.defer();
            spyOn(storageHttpWrapper, 'get').and.returnValue(storageHttpWrapperDefer.promise);
            spyOn(notify, 'error');
        });

        it('should be function', () => {
            expect(userContext.identifyStoragePermissions).toBeFunction();
        });

        it('should return promise', () => {
            expect(userContext.identifyStoragePermissions()).toBePromise();
        });

        describe('when an error occured while getting user', () => {

            beforeEach(() => {
                storageHttpWrapperDefer.reject();
            });

            it('should set storageIdentity to initial value', done => (async () => {
                await userContext.identifyStoragePermissions();
                expect(userContext.storageIdentity.availableStorageSpace).toBe(0);
                expect(userContext.storageIdentity.totalStorageSpace).toBe(0);
            })().then(done));

            it('should show notification error', done => (async () => {
                await userContext.identifyStoragePermissions();
                expect(notify.error).toHaveBeenCalledWith(localizationManager.localize('storageFailed'));
            })().then(done));

        });

        describe('when user received', () => {

            let userData = { AvailableStorageSpace: 100, TotalStorageSpace: 1000 };
            beforeEach(() => {
                storageHttpWrapperDefer.resolve(userData);
            });

            it('should set storageIdentity', done => (async () => {
                await userContext.identifyStoragePermissions();
                expect(userContext.storageIdentity.availableStorageSpace).toBe(userData.AvailableStorageSpace);
                expect(userContext.storageIdentity.totalStorageSpace).toBe(userData.TotalStorageSpace);
            })().then(done));

        });

    });

    describe('identifyExternalUser', () => {

        it('should be function', () => {
            expect(userContext.identifyExternalUser).toBeFunction();
        });

        it('should return promise', () => {
            spyOn(authHttpWrapper, 'post');
            expect(userContext.identifyExternalUser()).toBePromise();
        });

        describe('when token exists', () => {
            
            it('should send post request', () => {
                spyOn(authHttpWrapper, 'post');
                userContext.identifyExternalUser('auth/identify', 'tokenName', 'token');
                expect(authHttpWrapper.post).toHaveBeenCalledWith('auth/identify', { token: 'token' });
            });


            describe('when response contains unauthorized property', () => {

                beforeEach(() => {
                    spyOn(authHttpWrapper, 'post').and.returnValue(Promise.resolve({ unauthorized: true }));
                });

                it('should throw error with details', done => (async () => {
                    try {
                        await userContext.identifyExternalUser('auth/identify', 'tokenName', 'token');
                        throw 'promise should not be resolved';
                    } catch (e) {
                        expect(e.logout).toBeTruthy();
                        expect(e.tokenName).toBe('token');
                    }
                })().then(done));

            });

            describe('when callback is function', () => {

                var resp = {};

                beforeEach(() => {
                    spyOn(authHttpWrapper, 'post').and.returnValue(Promise.resolve(resp));
                });

                it('should call callback', done => (async () => {
                    var obj = { callback(){} };
                    spyOn(obj, 'callback');
                    await userContext.identifyExternalUser('auth/identify', 'tokenName', 'token', obj.callback);
                    expect(obj.callback).toHaveBeenCalledWith({});
                })().then(done));

            });

        });

    });

    describe('identifyLtiUser', () => {

        beforeEach(() => {
            spyOn(userContext, 'identifyExternalUser').and.returnValue(Promise.resolve(true));
            userContext.ltiData = { ltiUserInfoToken: 'token' };
        });

        it('should be function', () => {
            expect(userContext.identifyLtiUser).toBeFunction();
        });

        it('should return promise', () => {
            expect(userContext.identifyLtiUser()).toBePromise();
        });

        it('should call identifyExternalUser with appropriate arguments', done => (async () => {
            await userContext.identifyLtiUser();
            expect(userContext.identifyExternalUser).toHaveBeenCalledWith('auth/identifyLtiUser', 'ltiUserInfoToken', userContext.ltiData.ltiUserInfoToken, jasmine.any(Function));
        })().then(done));

    });

    describe('identifySamlUser', () => {

        beforeEach(() => {
            spyOn(userContext, 'identifyExternalUser').and.returnValue(Promise.resolve(true));
            userContext.samlData = { samlIdPUserInfoToken: 'token' };
        });

        it('should be function', () => {
            expect(userContext.identifySamlUser).toBeFunction();
        });

        it('should return promise', () => {
            expect(userContext.identifySamlUser()).toBePromise();
        });

        it('should call identifyExternalUser with appropriate arguments', done => (async () => {
            await userContext.identifySamlUser();
            expect(userContext.identifyExternalUser).toHaveBeenCalledWith('auth/identifySamlUser', 'samlIdPUserInfoToken', userContext.samlData.samlIdPUserInfoToken);
        })().then(done));

    });

    describe('hasStarterAccess:', () => {

        it('should be function', () => {
            expect(userContext.hasStarterAccess).toBeFunction();
        });

        describe('when user identity is not an object', () => {

            beforeEach(() => {
                userContext.identity = null;
            });

            it('should be false', () => {
                expect(userContext.hasStarterAccess()).toBeFalsy();
            });

        });

        describe('when user identity subscription is not an object', () => {

            beforeEach(() => {
                userContext.identity = {};
            });

            it('should be false', () => {
                expect(userContext.hasStarterAccess()).toBeFalsy();
            });

        });

        describe('when user has free subscription', () => {

            beforeEach(() => {
                userContext.identity = {
                    subscription: {
                        accessType: constants.accessType.free
                    }
                };
            });

            it('should be false', () => {
                expect(userContext.hasStarterAccess()).toBeFalsy();
            });

        });

        describe('when user has starter subscription', () => {

            var today = new Date();

            describe('and expiration date is null', () => {

                beforeEach(() => {
                    userContext.identity = {
                        subscription: {
                            accessType: constants.accessType.starter,
                            expirationDate: null
                        }
                    };
                });

                it('should be false', () => {
                    expect(userContext.hasStarterAccess()).toBeFalsy();
                });

            });

            describe('and expiration date has expired', () => {

                var yesterday = new Date();
                yesterday.setDate(today.getDate() - 1);

                beforeEach(() => {
                    userContext.identity = {
                        subscription: {
                            accessType: constants.accessType.starter,
                            expirationDate: yesterday
                        }
                    };
                });

                it('should be false', () => {
                    expect(userContext.hasStarterAccess()).toBeFalsy();
                });

            });

            describe('and expiration date has not yet expired', () => {

                var tomorrow = new Date();
                tomorrow.setDate(today.getDate() + 1);

                beforeEach(() => {
                    userContext.identity = {
                        subscription: {
                            accessType: constants.accessType.starter,
                            expirationDate: tomorrow
                        }
                    };
                });

                it('should be true', () => {
                    expect(userContext.hasStarterAccess()).toBeTruthy();
                });

            });

        });

        describe('when user has plus subscription', () => {
            var today = new Date();

            describe('and expiration date is null', () => {

                beforeEach(() => {
                    userContext.identity = {
                        subscription: {
                            accessType: constants.accessType.plus,
                            expirationDate: null
                        }
                    };
                });

                it('should be false', () => {
                    expect(userContext.hasStarterAccess()).toBeFalsy();
                });

            });

            describe('and expiration date has expired', () => {

                var yesterday = new Date();
                yesterday.setDate(today.getDate() - 1);

                beforeEach(() => {
                    userContext.identity = {
                        subscription: {
                            accessType: constants.accessType.plus,
                            expirationDate: yesterday
                        }
                    };
                });

                it('should be false', () => {
                    expect(userContext.hasStarterAccess()).toBeFalsy();
                });

            });

            describe('and expiration date has not yet expired', () => {

                var tomorrow = new Date();
                tomorrow.setDate(today.getDate() + 1);

                beforeEach(() => {
                    userContext.identity = {
                        subscription: {
                            accessType: constants.accessType.plus,
                            expirationDate: tomorrow
                        }
                    };
                });

                it('should be true', () => {
                    expect(userContext.hasStarterAccess()).toBeTruthy();
                });

            });
        });

        describe('when user has trial subscription', () => {
            var today = new Date();

            describe('and expiration date is null', () => {

                beforeEach(() => {
                    userContext.identity = {
                        subscription: {
                            accessType: constants.accessType.trial,
                            expirationDate: null
                        }
                    };
                });

                it('should be false', () => {
                    expect(userContext.hasStarterAccess()).toBeFalsy();
                });

            });

            describe('and expiration date has expired', () => {

                var yesterday = new Date();
                yesterday.setDate(today.getDate() - 1);

                beforeEach(() => {
                    userContext.identity = {
                        subscription: {
                            accessType: constants.accessType.trial,
                            expirationDate: yesterday
                        }
                    };
                });

                it('should be false', () => {
                    expect(userContext.hasStarterAccess()).toBeFalsy();
                });

            });

            describe('and expiration date has not yet expired', () => {

                var tomorrow = new Date();
                tomorrow.setDate(today.getDate() + 1);

                beforeEach(() => {
                    userContext.identity = {
                        subscription: {
                            accessType: constants.accessType.trial,
                            expirationDate: tomorrow
                        }
                    };
                });

                it('should be true', () => {
                    expect(userContext.hasStarterAccess()).toBeTruthy();
                });

            });
        });
    });

    describe('hasPlusAccess:', () => {

        it('should be function', () => {
            expect(userContext.hasPlusAccess).toBeFunction();
        });

        describe('when user identity is not an object', () => {

            beforeEach(() => {
                userContext.identity = null;
            });

            it('should be false', () => {
                expect(userContext.hasPlusAccess()).toBeFalsy();
            });

        });

        describe('when user identity subscription is not an object', () => {

            beforeEach(() => {
                userContext.identity = {};
            });

            it('should be false', () => {
                expect(userContext.hasPlusAccess()).toBeFalsy();
            });

        });

        describe('when user has free subscription', () => {

            beforeEach(() => {
                userContext.identity = {
                    subscription: {
                        accessType: constants.accessType.free
                    }
                };
            });

            it('should be false', () => {
                expect(userContext.hasPlusAccess()).toBeFalsy();
            });

        });

        describe('when user has starter subscription', () => {

            beforeEach(() => {
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

            it('should be false', () => {
                expect(userContext.hasPlusAccess()).toBeFalsy();
            });
        });

        describe('when user has plus subscription', () => {
            var today = new Date();

            describe('and expiration date is null', () => {

                beforeEach(() => {
                    userContext.identity = {
                        subscription: {
                            accessType: constants.accessType.plus,
                            expirationDate: null
                        }
                    };
                });

                it('should be false', () => {
                    expect(userContext.hasPlusAccess()).toBeFalsy();
                });

            });

            describe('and expiration date has expired', () => {

                var yesterday = new Date();
                yesterday.setDate(today.getDate() - 1);

                beforeEach(() => {
                    userContext.identity = {
                        subscription: {
                            accessType: constants.accessType.plus,
                            expirationDate: yesterday
                        }
                    };
                });

                it('should be false', () => {
                    expect(userContext.hasPlusAccess()).toBeFalsy();
                });

            });

            describe('and expiration date has not yet expired', () => {

                var tomorrow = new Date();
                tomorrow.setDate(today.getDate() + 1);

                beforeEach(() => {
                    userContext.identity = {
                        subscription: {
                            accessType: constants.accessType.plus,
                            expirationDate: tomorrow
                        }
                    };
                });

                it('should be true', () => {
                    expect(userContext.hasPlusAccess()).toBeTruthy();
                });

            });
        });

        describe('when user has trial subscription', () => {
            var today = new Date();

            describe('and expiration date is null', () => {

                beforeEach(() => {
                    userContext.identity = {
                        subscription: {
                            accessType: constants.accessType.trial,
                            expirationDate: null
                        }
                    };
                });

                it('should be false', () => {
                    expect(userContext.hasPlusAccess()).toBeFalsy();
                });

            });

            describe('and expiration date has expired', () => {

                var yesterday = new Date();
                yesterday.setDate(today.getDate() - 1);

                beforeEach(() => {
                    userContext.identity = {
                        subscription: {
                            accessType: constants.accessType.trial,
                            expirationDate: yesterday
                        }
                    };
                });

                it('should be false', () => {
                    expect(userContext.hasPlusAccess()).toBeFalsy();
                });

            });

            describe('and expiration date has not yet expired', () => {

                var tomorrow = new Date();
                tomorrow.setDate(today.getDate() + 1);

                beforeEach(() => {
                    userContext.identity = {
                        subscription: {
                            accessType: constants.accessType.trial,
                            expirationDate: tomorrow
                        }
                    };
                });

                it('should be true', () => {
                    expect(userContext.hasPlusAccess()).toBeTruthy();
                });

            });
        });

    });

    describe('hasAcademyAccess:', () => {

        it('should be function', () => {
            expect(userContext.hasAcademyAccess).toBeFunction();
        });

        describe('when user identity is not an object', () => {

            beforeEach(() => {
                userContext.identity = null;
            });

            it('should be false', () => {
                expect(userContext.hasAcademyAccess()).toBeFalsy();
            });

        });

        describe('when user identity subscription is not an object', () => {

            beforeEach(() => {
                userContext.identity = {};
            });

            it('should be false', () => {
                expect(userContext.hasAcademyAccess()).toBeFalsy();
            });

        });

        describe('when user has free subscription', () => {

            beforeEach(() => {
                userContext.identity = {
                    subscription: {
                        accessType: constants.accessType.free
                    }
                };
            });

            it('should be false', () => {
                expect(userContext.hasAcademyAccess()).toBeFalsy();
            });

        });

        describe('when user has starter subscription', () => {

            beforeEach(() => {
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

            it('should be false', () => {
                expect(userContext.hasAcademyAccess()).toBeFalsy();
            });
        });

        describe('when user has plus subscription', () => {

            beforeEach(() => {
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

            it('should be false', () => {
                expect(userContext.hasAcademyAccess()).toBeFalsy();
            });
        });

        describe('when user has academy subscription', () => {
            var today = new Date();

            describe('and expiration date is null', () => {

                beforeEach(() => {
                    userContext.identity = {
                        subscription: {
                            accessType: constants.accessType.academy,
                            expirationDate: null
                        }
                    };
                });

                it('should be false', () => {
                    expect(userContext.hasAcademyAccess()).toBeFalsy();
                });

            });

            describe('and expiration date has expired', () => {

                var yesterday = new Date();
                yesterday.setDate(today.getDate() - 1);

                beforeEach(() => {
                    userContext.identity = {
                        subscription: {
                            accessType: constants.accessType.academy,
                            expirationDate: yesterday
                        }
                    };
                });

                it('should be false', () => {
                    expect(userContext.hasAcademyAccess()).toBeFalsy();
                });

            });

            describe('and expiration date has not yet expired', () => {

                var tomorrow = new Date();
                tomorrow.setDate(today.getDate() + 1);

                beforeEach(() => {
                    userContext.identity = {
                        subscription: {
                            accessType: constants.accessType.academy,
                            expirationDate: tomorrow
                        }
                    };
                });

                it('should be true', () => {
                    expect(userContext.hasAcademyAccess()).toBeTruthy();
                });

            });
        });

        describe('when user has trial subscription', () => {
            var today = new Date();

            describe('and expiration date is null', () => {

                beforeEach(() => {
                    userContext.identity = {
                        subscription: {
                            accessType: constants.accessType.trial,
                            expirationDate: null
                        }
                    };
                });

                it('should be false', () => {
                    expect(userContext.hasAcademyAccess()).toBeFalsy();
                });

            });

            describe('and expiration date has expired', () => {

                var yesterday = new Date();
                yesterday.setDate(today.getDate() - 1);

                beforeEach(() => {
                    userContext.identity = {
                        subscription: {
                            accessType: constants.accessType.trial,
                            expirationDate: yesterday
                        }
                    };
                });

                it('should be false', () => {
                    expect(userContext.hasAcademyAccess()).toBeFalsy();
                });

            });

            describe('and expiration date has not yet expired', () => {

                var tomorrow = new Date();
                tomorrow.setDate(today.getDate() + 1);

                beforeEach(() => {
                    userContext.identity = {
                        subscription: {
                            accessType: constants.accessType.trial,
                            expirationDate: tomorrow
                        }
                    };
                });

                it('should be true', () => {
                    expect(userContext.hasAcademyAccess()).toBeTruthy();
                });

            });
        });

    });

    describe('hasTrialAccess:', () => {

        it('should be function', () => {
            expect(userContext.hasTrialAccess).toBeFunction();
        });

        describe('when user identity is not an object', () => {

            beforeEach(() => {
                userContext.identity = null;
            });

            it('should be false', () => {
                expect(userContext.hasTrialAccess()).toBeFalsy();
            });

        });

        describe('when user identity subscription is not an object', () => {

            beforeEach(() => {
                userContext.identity = {};
            });

            it('should be false', () => {
                expect(userContext.hasTrialAccess()).toBeFalsy();
            });

        });

        describe('when user has free subscription', () => {

            beforeEach(() => {
                userContext.identity = {
                    subscription: {
                        accessType: constants.accessType.free
                    }
                };
            });

            it('should be false', () => {
                expect(userContext.hasTrialAccess()).toBeFalsy();
            });

        });

        describe('when user has starter subscription', () => {

            beforeEach(() => {
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

            it('should be false', () => {
                expect(userContext.hasTrialAccess()).toBeFalsy();
            });
        });

        describe('when user has plus subscription', () => {

            beforeEach(() => {
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

            it('should be false', () => {
                expect(userContext.hasTrialAccess()).toBeFalsy();
            });
        });

        describe('when user has trial subscription', () => {
            var today = new Date();

            describe('and expiration date is null', () => {

                beforeEach(() => {
                    userContext.identity = {
                        subscription: {
                            accessType: constants.accessType.trial,
                            expirationDate: null
                        }
                    };
                });

                it('should be false', () => {
                    expect(userContext.hasTrialAccess()).toBeFalsy();
                });

            });

            describe('and expiration date has expired', () => {

                var yesterday = new Date();
                yesterday.setDate(today.getDate() - 1);

                beforeEach(() => {
                    userContext.identity = {
                        subscription: {
                            accessType: constants.accessType.trial,
                            expirationDate: yesterday
                        }
                    };
                });

                it('should be false', () => {
                    expect(userContext.hasTrialAccess()).toBeFalsy();
                });

            });

            describe('and expiration date has not yet expired', () => {

                var tomorrow = new Date();
                tomorrow.setDate(today.getDate() + 1);

                beforeEach(() => {
                    userContext.identity = {
                        subscription: {
                            accessType: constants.accessType.trial,
                            expirationDate: tomorrow
                        }
                    };
                });

                it('should be true', () => {
                    expect(userContext.hasTrialAccess()).toBeTruthy();
                });

            });
        });
    });

    describe('hasFreeAccess:', () => {

        it('should be function', () => {
            expect(userContext.hasFreeAccess).toBeFunction();
        });

        describe('when user identity is not an object', () => {

            beforeEach(() => {
                userContext.identity = null;
            });

            it('should be true', () => {
                expect(userContext.hasFreeAccess()).toBeTruthy();
            });

        });

        describe('when user identity subscription is not an object', () => {

            beforeEach(() => {
                userContext.identity = {};
            });

            it('should be true', () => {
                expect(userContext.hasFreeAccess()).toBeTruthy();
            });

        });

        describe('when user has free subscription', () => {

            beforeEach(() => {
                userContext.identity = {
                    subscription: {
                        accessType: constants.accessType.free
                    }
                };
            });

            it('should be true', () => {
                expect(userContext.hasFreeAccess()).toBeTruthy();
            });

        });

        describe('when subscription expired', () => {
            
            beforeEach(() => {
                var today = new Date(),
                    yesterday = new Date();
                yesterday.setDate(today.getDate() - 1);

                userContext.identity = {
                    subscription: {
                        accessType: constants.accessType.starter,
                        expirationDate: yesterday
                    }
                };
            });

            it('should be true', () => {
                expect(userContext.hasFreeAccess()).toBeTruthy();
            });

        });

        describe('when user has starter subscription', () => {

            beforeEach(() => {
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

            it('should be false', () => {
                expect(userContext.hasFreeAccess()).toBeFalsy();
            });
        });

        describe('when user has plus subscription', () => {

            beforeEach(() => {
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

            it('should be false', () => {
                expect(userContext.hasFreeAccess()).toBeFalsy();
            });
        });

        describe('when user has trial subscription', () => {
            var today = new Date();

            describe('and expiration date is null', () => {

                beforeEach(() => {
                    userContext.identity = {
                        subscription: {
                            accessType: constants.accessType.trial,
                            expirationDate: null
                        }
                    };
                });

                it('should be true', () => {
                    expect(userContext.hasFreeAccess()).toBeTruthy();
                });

            });

            describe('and expiration date has expired', () => {

                var yesterday = new Date();
                yesterday.setDate(today.getDate() - 1);

                beforeEach(() => {
                    userContext.identity = {
                        subscription: {
                            accessType: constants.accessType.trial,
                            expirationDate: yesterday
                        }
                    };
                });

                it('should be true', () => {
                    expect(userContext.hasFreeAccess()).toBeTruthy();
                });

            });

            describe('and expiration date has not yet expired', () => {

                var tomorrow = new Date();
                tomorrow.setDate(today.getDate() + 1);

                beforeEach(() => {
                    userContext.identity = {
                        subscription: {
                            accessType: constants.accessType.trial,
                            expirationDate: tomorrow
                        }
                    };
                });

                it('should be false', () => {
                    expect(userContext.hasFreeAccess()).toBeFalsy();
                });

            });
        });
    });
});