import userMenu from './userMenu';

import userContext from 'userContext';
import eventTracker from 'eventTracker';
import constants from 'constants';
import router from 'routing/router';
import app from 'durandal/app';
import createOrganizationCommand from 'organizations/commands/createOrganization';
import upgradeDialog from 'widgets/upgradeDialog/viewmodel';

describe('viewModel [userMenu]', () => {

    beforeEach(() => {
        spyOn(userContext, 'hasFreeAccess').and.returnValue(true);
        spyOn(userContext, 'hasTrialAccess').and.returnValue(true);
        spyOn(app, 'on');
        spyOn(router, 'navigate');
        spyOn(upgradeDialog, 'show');
    });

    describe('username:', () => {
        it('should be defined', () => {
            expect(userMenu.username).toBeDefined();
        });
    });

    describe('useremail:', () => {
        it('should be defined', () => {
            expect(userMenu.useremail).toBeDefined();
        });
    });

    describe('newEditor:', () => {
        it('should be defined', () => {
            expect(userMenu.newEditor).toBeDefined();
        });
    });
    
    describe('isOrganizationAdmin:', () => {
        it('should be observable', () => {
            expect(userMenu.isOrganizationAdmin).toBeObservable();
        });
    });

    describe('isOrganizationMember:', () => {
        it('should be observable', () => {
            expect(userMenu.isOrganizationMember).toBeObservable();
        });
    });

    describe('orgganizationTitle:', () => {
        it('should be observable:', () => {
            expect(userMenu.organizationTitle).toBeObservable();
        });
    }); 

    describe('hasOrganizationInvites:', () => {
        it('should be observable', () => {
            expect(userMenu.hasOrganizationInvites).toBeObservable();
        });
    });

    describe('avatarLetter:', () => {
        it('should be defined', () => {
            expect(userMenu.avatarLetter).toBeDefined();
        });
    });

    describe('isFreeUser:', () => {
        it('should be observable', () => {
            expect(userMenu.isFreeUser).toBeObservable();
        });
    });

    describe('userPlanChanged', () => {
        it('should be function', () => {
            expect(userMenu.userPlanChanged).toBeFunction();
        });

        it('should call userContext hasFreeAccess', () => {
            userMenu.userPlanChanged();
            expect(userContext.hasFreeAccess).toHaveBeenCalled();
        });

        it('should set isFreeUser', () => {
            userMenu.isFreeUser(false);
            userMenu.userPlanChanged();
            expect(userMenu.isFreeUser()).toBeTruthy();
        });
    });

    describe('activate:', () => {
        beforeEach(() => {
            userContext.identity = null;
        });

        it('should be function', () => {
            expect(userMenu.activate).toBeFunction();
        });

        it('should subscribe on organization created event', () => {
            userMenu.activate();
                
            expect(app.on).toHaveBeenCalledWith(constants.messages.organization.created, jasmine.any(Function));
        });

        it('should subscribe on organization membership started event', () => {
            userMenu.activate();
                
            expect(app.on).toHaveBeenCalledWith(constants.messages.organization.membershipStarted, jasmine.any(Function));
        });

        it('should subscribe on organization membership finished event', () => {
            userMenu.activate();
                
            expect(app.on).toHaveBeenCalledWith(constants.messages.organization.membershipFinished, jasmine.any(Function));
        });

        it('should subscribe on organization invite created event', () => {
            userMenu.activate();
                
            expect(app.on).toHaveBeenCalledWith(constants.messages.organization.inviteCreated, jasmine.any(Function));
        });

        it('should subscribe on organization invite removed event', () => {
            userMenu.activate();
                
            expect(app.on).toHaveBeenCalledWith(constants.messages.organization.inviteRemoved, jasmine.any(Function));
        });

        it('should subscribe on organization user status updated event', () => {
            userMenu.activate();
                
            expect(app.on).toHaveBeenCalledWith(constants.messages.organization.userStatusUpdated, jasmine.any(Function));
        });

        it('should subscribe on organization title updated event', () => {
            userMenu.activate();
                
            expect(app.on).toHaveBeenCalledWith(constants.messages.organization.titleUpdated, jasmine.any(Function));
        });

        describe('when user is anonymous', () => {

            beforeEach(() => {
                userContext.identity = null;
            });

            it('should set username to null', () => {
                userMenu.activate();
                expect(userMenu.username).toBeNull();
            });

            it('should set useremail to null', () => {
                userMenu.activate();
                expect(userMenu.useremail).toBeNull();
            });

            it('should set avatarLetter to null', () => {
                userMenu.activate();
                expect(userMenu.avatarLetter).toBeNull();
            });

        });

        describe('when user is not anonymous', () => {

            beforeEach(() => {
                userContext.identity = {
                    email: '',
                    fullname: ' ',
                    isOrganizationAdmin: () => { return false; },
                    isOrganizationMember: () => { return true; },
                    hasOrganizationInvites: () => { return false; }
                };
            });

            describe('and user does not have fullname', () => {
                var email = 'usermail@easygenerator.com';
                beforeEach(() => {
                    userContext.identity.email = email;
                    userContext.identity.fullname = '';
                });

                it('should set email to username', () => {
                    userMenu.activate();
                    expect(userMenu.username).toBe(userContext.identity.email);
                });

                it('should set avatarLetter to first email letter', () => {
                    userMenu.avatarLetter = null;
                    userMenu.activate();
                    expect(userMenu.avatarLetter).toBe(email.charAt(0));
                });
            });

            describe('and user has fullname', () => {
                var fullName = 'username';
                beforeEach(() => {
                    userContext.identity.fullname = fullName;
                });

                it('should set fullname to username', () => {
                    userMenu.activate();
                    expect(userMenu.username).toBe(userContext.identity.fullname);
                });

                it('should set avatarLetter to first fullName letter', () => {
                    userMenu.avatarLetter = null;
                    userMenu.activate();
                    expect(userMenu.avatarLetter).toBe(fullName.charAt(0));
                });

            });

            it('should set isOrganizationAdmin', () => {
                userMenu.isOrganizationAdmin(true);
                userMenu.activate();
                expect(userMenu.isOrganizationAdmin()).toBeFalsy();
            });

            it('should set hasOrganizationInvites', () => {
                userMenu.hasOrganizationInvites(true);
                userMenu.activate();
                expect(userMenu.hasOrganizationInvites()).toBeFalsy();
            });

            it('should set isOrganizationMember', () => {
                userMenu.isOrganizationMember(false);
                userMenu.activate();
                expect(userMenu.isOrganizationMember()).toBeTruthy();
            });

            it('should set organization title', () => {
                spyOn(userMenu, 'setOrganizationTitle');
                userMenu.activate();
                expect(userMenu.setOrganizationTitle).toHaveBeenCalled();
            });

        });

        it('should set newEditor', () => {
            userMenu.newEditor(null);
            userMenu.activate({ newEditor: true });
            expect(userMenu.newEditor()).toBeTruthy();
        });

        it('should set switchEditor function', () => {
            var switchEditor = function() {};
            userMenu.activate({ switchEditor: switchEditor });
            expect(userMenu.switchEditor).toBe(switchEditor);
        });

        it('should set isFreeUser', () => {
            userMenu.isFreeUser(false);
            userMenu.activate();
            expect(userMenu.isFreeUser()).toBeTruthy();
        });
    });

    describe('setOrganizationTitle:', () => {
        beforeEach(() => {
            userMenu.organizationTitle(null);
        });

        describe('when user is not a member of any organization', () => {
            beforeEach(() => {
                userContext.identity = {
                    organizations: []
                };
            });

            it('should set organization title to empty string', () => {
                userMenu.setOrganizationTitle();
                expect(userMenu.organizationTitle()).toBe('');
            });
        });

        describe('when user is a member of organization', () => {
            let organizationTitle = 'title';
            beforeEach(() => {
                userContext.identity = {
                    organizations: [{ title: organizationTitle }]
                };
            });

            it('should set organization title', () => {
                userMenu.setOrganizationTitle();
                expect(userMenu.organizationTitle()).toBe(organizationTitle);
            });
        });

        describe('when user is a member of few organizations', () => {
            let organizationTitle1 = 'title1', organizationTitle2='title2';
            beforeEach(() => {
                userContext.identity = {
                    organizations: [{ title: organizationTitle2 }, { title: organizationTitle1 }]
                };
            });

            it('should set organization title', () => {
                userMenu.setOrganizationTitle();
                expect(userMenu.organizationTitle()).toBe(organizationTitle1 + ', ' + organizationTitle2);
            });
        });
    });

    describe('organizationMembershipUpdated:', () => {
        beforeEach(() => {
            userContext.identity = {
                isOrganizationAdmin: () => { return false; },
                isOrganizationMember: () => { return true; }
            };
        });

        it('should set isOrganizationAdmin', () => {
            userMenu.isOrganizationAdmin(true);
            userMenu.organizationMembershipUpdated();
            expect(userMenu.isOrganizationAdmin()).toBeFalsy();
        });

        it('should set isOrganizationMember', () => {
            userMenu.isOrganizationMember(false);
            userMenu.organizationMembershipUpdated();
            expect(userMenu.isOrganizationMember()).toBeTruthy();
        });

        it('should set organization title', () => {
            spyOn(userMenu, 'setOrganizationTitle');
            userMenu.organizationMembershipUpdated();
            expect(userMenu.setOrganizationTitle).toHaveBeenCalled();
        });
    });

    describe('organizationInvitesUpdated:', () => {
        it('should set hasOrganizationInvites', () => {
            userContext.identity = {
                hasOrganizationInvites: () => { return true; }
            };

            userMenu.hasOrganizationInvites(false);
            userMenu.organizationInvitesUpdated();
            expect(userMenu.hasOrganizationInvites()).toBe(true);
        });
    });

    describe('createOrganization:', () => {
        describe('when user has academy access', () => {
            beforeEach(() => {
                spyOn(userContext, 'hasAcademyAccess').and.returnValue(true);
            });

            it('should call create organization command', done => (async () => {
                spyOn(createOrganizationCommand, 'execute').and.returnValue(Promise.resolve(true));

                await userMenu.createOrganization();

                expect(createOrganizationCommand.execute).toHaveBeenCalled();

            })().then(done));


            describe('and when organization created successfully', () => {
                var organization = {
                    id: 'id'
                };
                beforeEach(() => {
                    spyOn(createOrganizationCommand, 'execute').and.returnValue(Promise.resolve(organization));
                });

                it('should navigate to organization', done => (async () => {
                    await userMenu.createOrganization();

                    expect(router.navigate).toHaveBeenCalledWith('organizations/' + organization.id);

                })().then(done));
            });
        });

        describe('when user doesnt have academy access', () => {
            beforeEach(() => {
                spyOn(userContext, 'hasAcademyAccess').and.returnValue(false);
            });

            it('should show ugrade dialog', done => (async () => {
                spyOn(createOrganizationCommand, 'execute').and.returnValue(Promise.resolve(true));

                await userMenu.createOrganization();

                expect(upgradeDialog.show).toHaveBeenCalledWith(constants.dialogs.upgrade.settings.manageOrganization);

            })().then(done));
        });
    });

    describe('manageOrganization:', () => {
        describe('when user has academy access', () => {
            beforeEach(() => {
                spyOn(userContext, 'hasAcademyAccess').and.returnValue(true);
            });

            describe('and user is organization member', () => {
                var organization = {
                    id: 'id'
                };

                beforeEach(() => {
                    userContext.identity = {
                        isOrganizationMember: () => { return true; },
                        organizations: [{ id: organization.id }]
                    };

                    it('should navigate to first organization in context', () => {
                        userMenu.manageOrganization();
                        expect(router.navigate).toHaveBeenCalledWith('organizations/' + organization.id);
                    });
                });
            });

            describe('and user is not organization member', () => {
                beforeEach(() => {
                    userContext.identity = {
                        isOrganizationMember: () => { return false; }
                    };

                    it('should not navigate', () => {
                        userMenu.manageOrganization();
                        expect(router.navigate).not.toHaveBeenCalled();
                    });
                });
            });
        });

        describe('when user doesnt have academy access', () => {
            beforeEach(() => {
                spyOn(userContext, 'hasAcademyAccess').and.returnValue(false);
            });

            it('should show ugrade dialog', () => {
                userMenu.manageOrganization();
                expect(upgradeDialog.show).toHaveBeenCalledWith(constants.dialogs.upgrade.settings.manageOrganization);
            });
        });
    });

    describe('openUpgradePlanUrl:', () => {

        beforeEach(() => {
            spyOn(eventTracker, 'publish');
            spyOn(window, 'open');
        });

        it('should be function', () => {
            expect(userMenu.openUpgradePlanUrl).toBeFunction();
        });

        it('should send event \'Upgrade now\'', () => {
            userMenu.openUpgradePlanUrl();
            expect(eventTracker.publish).toHaveBeenCalledWith(constants.upgradeEvent, constants.upgradeCategory.userMenuInHeader);
        });

        it('should open upgrade link in new window', () => {
            userMenu.openUpgradePlanUrl();
            expect(window.open).toHaveBeenCalledWith(constants.upgradeUrl, '_blank');
        });

    });

    describe('signOut:', () => {

        var storage;
        var length;

        beforeEach(() => {
            spyOn(router, 'setLocation');
            spyOn(window.auth, 'logout');
        });

        it('should be function', () => {
            expect(userMenu.signOut).toBeFunction();
        });

        it('should call logout', () => {
            userMenu.signOut();
            expect(window.auth.logout).toHaveBeenCalled();
        });

        it('should open signup page', () => {
            userMenu.signOut();
            expect(router.setLocation).toHaveBeenCalledWith(constants.signinUrl);
        });

    });

});
