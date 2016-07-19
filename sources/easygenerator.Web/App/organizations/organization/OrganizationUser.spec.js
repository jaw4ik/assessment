import OrganizationUser from 'organizations/organization/OrganizationUser';

import userContext from 'userContext';
import app from 'durandal/app';
import constants from 'constants';

describe('organization [OrganizationUser]', () => {
    let userData,
        user;

    beforeEach(() => {
        spyOn(app, 'on');
        spyOn(app, 'off');

        userData = {
            id: 'id',
            email: 'email',
            fullName: 'name',
            isAdmin: false,
            isRegistered: false,
            createdOn: new Date(),
            status: constants.organizationUserStatus.accepted
        };

        userContext.identity = { email: userData.email };
    });

    describe('ctor:', () => {

        describe('id:', () => {
            it('should be set', () => {
                user = new OrganizationUser(userData);
                expect(user.id).toBe(userData.id);
            });
        });

        describe('email:', () => {
            it('should be set', () => {
                user = new OrganizationUser(userData);
                expect(user.email).toBe(userData.email);
            });
        });

        describe('isAdmin:', () => {
            it('should be set', () => {
                user = new OrganizationUser(userData);
                expect(user.isAdmin).toBe(userData.isAdmin);
            });
        });

        describe('createdOn:', () => {
            it('should be set', () => {
                user = new OrganizationUser(userData);
                expect(user.createdOn).toBe(userData.createdOn);
            });
        });

        describe('isRegistered:', () => {
            it('should be observable', () => {
                user = new OrganizationUser(userData);
                expect(user.isRegistered).toBeObservable();
            });

            it('should be set', () => {
                user = new OrganizationUser(userData);
                expect(user.isRegistered()).toBe(userData.isRegistered);
            });
        });

        describe('isReinviting:', () => {
            it('should be observable', () => {
                user = new OrganizationUser(userData);
                expect(user.isReinviting).toBeObservable();
            });

            it('should be false', () => {
                user = new OrganizationUser(userData);
                expect(user.isReinviting()).toBeFalsy();
            });
        });

        describe('status:', () => {
            it('should be observable', () => {
                user = new OrganizationUser(userData);
                expect(user.status).toBeObservable();
            });

            it('should be set', () => {
                user = new OrganizationUser(userData);
                expect(user.status()).toBe(userData.status);
            });
        });

        describe('isWaitingForAcceptance:', () => {
            it('should be computed', () => {
                user = new OrganizationUser(userData);
                expect(user.isWaitingForAcceptance).toBeComputed();
            });

            describe('when status is waiting for acceptance', () => {
                it('should be true', () => {
                    userData.status = constants.organizationUserStatus.waitingForAcceptance;
                    user = new OrganizationUser(userData);
                    expect(user.isWaitingForAcceptance()).toBeTruthy();
                });
            });

            describe('when status is waiting for email confirmation', () => {
                it('should be true', () => {
                    userData.status = constants.organizationUserStatus.waitingForEmailConfirmation;
                    user = new OrganizationUser(userData);
                    expect(user.isWaitingForAcceptance()).toBeTruthy();
                });
            });

            describe('when status is NOT waiting for acceptance or waiting for acceptance', () => {
                it('should be false', () => {
                    userData.status = constants.organizationUserStatus.declined;
                    user = new OrganizationUser(userData);
                    expect(user.isWaitingForAcceptance()).toBeFalsy();
                });
            });
        });

        describe('isDeclined:', () => {
            it('should be computed', () => {
                user = new OrganizationUser(userData);
                expect(user.isDeclined).toBeComputed();
            });

            describe('when status is declined', () => {
                it('should be true', () => {
                    userData.status = constants.organizationUserStatus.declined;
                    user = new OrganizationUser(userData);
                    expect(user.isDeclined()).toBeTruthy();
                });
            });

            describe('when status is NOT declined', () => {
                it('should be false', () => {
                    userData.status = constants.organizationUserStatus.accepted;
                    user = new OrganizationUser(userData);
                    expect(user.isDeclined()).toBeFalsy();
                });
            });
        });

        describe('fullName:', () => {
            it('should be observable', () => {
                user = new OrganizationUser(userData);
                expect(user.fullName).toBeObservable();
            });

            it('should be set', () => {
                user = new OrganizationUser(userData);
                expect(user.fullName()).toBe(userData.fullName);
            });
        });

        describe('name:', () => {
            describe('when user has fullname', () => {
                beforeEach(() => {
                    userData.fullName = 'James Bond';
                });

                it('should be set to user fullName', () => {
                    user = new OrganizationUser(userData);
                    expect(user.name()).toBe(userData.fullName);
                });
            });

            describe('when user doesnt have fullname', () => {
                beforeEach(() => {
                    userData.fullName = '';
                });

                it('should be set to user email', () => {
                    user = new OrganizationUser(userData);
                    expect(user.name()).toBe(userData.email);
                });
            });
        });

        describe('avatarLetter:', () => {
            describe('when user ihas fullname', () => {
                beforeEach(() => {
                    userData.fullName = 'James Bond';
                });

                it('should be set to user fullName first letter', () => {
                    user = new OrganizationUser(userData);
                    expect(user.avatarLetter()).toBe(userData.fullName.charAt(0));
                });
            });

            describe('when user doesnt have fullname', () => {
                beforeEach(() => {
                    userData.fullName = '';
                });

                it('should be set to user email first letter', () => {
                    user = new OrganizationUser(userData);
                    expect(user.avatarLetter()).toBe(userData.email.charAt(0));
                });
            });
        });

        describe('isActivated:', () => {
            it('should be observable', () => {
                user = new OrganizationUser(userData);
                expect(user.isActivated).toBeObservable();
            });

            describe('when user is registered', () => {
                beforeEach(() => {
                    userData.isRegistered = true;
                });

                describe('and when user status is accepted', () => {
                    beforeEach(() => {
                        userData.status = constants.organizationUserStatus.accepted;
                    });

                    it('should be true', () => {
                        user = new OrganizationUser(userData);
                        expect(user.isActivated()).toBeTruthy();
                    });
                });

                describe('and when user is not accepted', () => {
                    beforeEach(() => {
                        userData.status = constants.organizationUserStatus.declined;
                    });

                    it('should be false', () => {
                        user = new OrganizationUser(userData);
                        expect(user.isActivated()).toBeFalsy();
                    });
                });
            });

            describe('when user is not registered', () => {
                beforeEach(() => {
                    userData.isRegistered = false;
                });

                describe('and when user status is accepted', () => {
                    beforeEach(() => {
                        userData.status = constants.organizationUserStatus.accepted;
                    });

                    it('should be false', () => {
                        user = new OrganizationUser(userData);
                        expect(user.isActivated()).toBeFalsy();
                    });
                });

                describe('and when user status is not accepted', () => {
                    beforeEach(() => {
                        userData.status = constants.organizationUserStatus.declined;
                    });

                    it('should be false', () => {
                        user = new OrganizationUser(userData);
                        expect(user.isActivated()).toBeFalsy();
                    });
                });
            });
        });

        describe('canBeRemoved:', () => {
            describe('when user email is current user email', () => {
                beforeEach(() => {
                    userContext.identity = { email: userData.email };
                });

                it('should be false', () => {
                    user = new OrganizationUser(userData);
                    expect(user.canBeRemoved).toBeFalsy();
                });
            });

            describe('when user email is not current user email', () => {
                beforeEach(() => {
                    userContext.identity = { email: 'some email' };
                });

                it('should be true', () => {
                    user = new OrganizationUser(userData);
                    expect(user.canBeRemoved).toBeTruthy();
                });
            });
        });

        describe('when user is not registered', () => {
            beforeEach(() => {
                userData.isRegistered = false;
            });

            it('should subscribe on organization user registered event', () => {
                user = new OrganizationUser(userData);

                expect(app.on).toHaveBeenCalledWith(constants.messages.organization.userRegistered + userData.email, jasmine.any(Function));
            });
        });

        describe('when user is registered', () => {
            beforeEach(() => {
                userData.isRegistered = true;
            });

            it('should not subscribe on organization user registered event', () => {
                user = new OrganizationUser(userData);

                expect(app.on).not.toHaveBeenCalledWith(constants.messages.organization.userRegistered + userData.email, jasmine.any(Function));
            });
        });

        it('should subscribe on organization user status updated event', () => {
            user = new OrganizationUser(userData);

            expect(app.on).toHaveBeenCalledWith(constants.messages.organization.userStatusUpdated + userData.id, jasmine.any(Function));
        });
    });

    describe('deactivate:', () => {
        beforeEach(() => {
            user = new OrganizationUser(userData);
        });

        describe('when user is not registered', () => {
            beforeEach(() => {
                user.isRegistered(false);
            });

            it('should unsubscribe from organization user registered event', () => {
                user.deactivate();
                expect(app.off).toHaveBeenCalledWith(constants.messages.organization.userRegistered + user.email, jasmine.any(Function));
            });
        });

        describe('when user is registered', () => {
            beforeEach(() => {
                user.isRegistered(true);
            });

            it('should not unsubscribe from organization user registered event', () => {
                user.deactivate();
                expect(app.off).not.toHaveBeenCalledWith(constants.messages.organization.userRegistered + user.email, jasmine.any(Function));
            });
        });

        it('should unsubscribe from organization user status updated event', () => {
            user.deactivate();
            expect(app.off).toHaveBeenCalledWith(constants.messages.organization.userStatusUpdated + userData.id, jasmine.any(Function));
        });
    });

    describe('userRegistered:', () => {
        beforeEach(() => {
            user = new OrganizationUser(userData);
        });

        it('should unsubscribe from organization user registered event', () => {
            user.userRegistered({ fullName: 'name' });

            expect(app.off).toHaveBeenCalledWith(constants.messages.organization.userRegistered + user.email, jasmine.any(Function));
        });

        it('should set isRegistered to true', () => {
            user.isRegistered(false);

            user.userRegistered({ fullName: 'name' });

            expect(user.isRegistered()).toBeTruthy();
        });

        it('should set user fullName', () => {
            user.fullName('');

            user.userRegistered({ fullName: 'name' });

            expect(user.fullName()).toBe('name');
        });
    });

    describe('userStatusUpdated:', () => {
        beforeEach(() => {
            user = new OrganizationUser(userData);
        });

        it('should set isAccepted to true', () => {
            user.status(constants.organizationUserStatus.waitingForAcceptance);

            user.userStatusUpdated(constants.organizationUserStatus.accepted);

            expect(user.status()).toBe(constants.organizationUserStatus.accepted);
        });
    });
});