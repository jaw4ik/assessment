import viewModel from 'organizations/organization/organization';

import router from 'routing/router';
import getOrganizationCommand from 'organizations/commands/getOrganization';
import getOrganizationUsersCommand from 'organizations/commands/getOrganizationUsers';
import updateOrganizationTitleCommand from 'organizations/commands/updateOrganizationTitle';
import removeUserDialog from 'dialogs/organizations/removeUser/removeUser';
import inviteOrganizationUsersDialog from 'dialogs/organizations/inviteUsers/inviteUsers';
import reinviteUserCommand from 'organizations/commands/reinviteUser';
import userContext from 'userContext';
import constants from 'constants';
import app from 'durandal/app';
import eventTracker from 'eventTracker';
import ko from 'knockout';
import notify from 'notify';
import localizationManager from 'localization/localizationManager';

describe('organization [organization]', () => {
    let organization = {
        id: 'id',
        title: 'title'
    },
        organizationUser = {
            id: 'id',
            isRegistered: true,
            fullName: 'user',
            email: 'email1',
            createdOn: new Date()
        },
        organizationAdmin = {
            id: 'adminId',
            isRegistered: true,
            fullName: 'admin',
            email: 'email2',
            createdOn: new Date(1)
        };

    beforeEach(() => {
        userContext.identity = {
            email: 'mail'
        };

        spyOn(app, 'on');
        spyOn(app, 'off');
        spyOn(eventTracker, 'publish');
        spyOn(notify, 'success');
        spyOn(localizationManager, 'localize').and.callFake(arg => { return arg; });
    });

    describe('users:', () => {
        it('should be observable array', () => {
            expect(viewModel.users).toBeObservableArray();
        });
    });

    describe('isInviteUsersDialogShown:', () => {
        it('should be observable', () => {
            expect(viewModel.isInviteUsersDialogShown).toBeObservable();
        });
    });

    describe('canActivate:', () => {

        describe('when user has academy access', () => {

            beforeEach(() => {
                spyOn(userContext, 'hasAcademyAccess').and.returnValue(true);
            });
            
            it('should execute getOrganization command', done => (async () => {
                spyOn(getOrganizationCommand, 'execute').and.returnValue(Promise.resolve(organization));
                
                await viewModel.canActivate(organization.id);
                
                expect(getOrganizationCommand.execute).toHaveBeenCalledWith(organization.id);
                
            })().then(done));

            describe('and when organization received', () => {
                describe('and when user has admin access', () => {
                    beforeEach(() => {
                        organization.grantsAdminAccess = true;
                        spyOn(getOrganizationCommand, 'execute').and.returnValue(Promise.resolve(organization));
                    });

                    it('should return true', done => (async () => {
                        let result = await viewModel.canActivate(organization.id);
                
                        expect(result).toBeTruthy();
                
                    })().then(done));
                });

                describe('and when user doesnt have admin access', () => {
                    beforeEach(() => {
                        organization.grantsAdminAccess = false;
                        spyOn(getOrganizationCommand, 'execute').and.returnValue(Promise.resolve(organization));
                    });

                    it('should return redirect 404', done => (async () => {
                        let result = await viewModel.canActivate(organization.id);
                
                        expect(result).toEqual({redirect: "404"});
                
                    })().then(done));
                });
            });

            describe('and when failed to get organization', () => {
                it('should return redirect 404', done => (async () => {
                    spyOn(getOrganizationCommand, 'execute').and.returnValue(Promise.reject('reason'));
                
                    let result = await viewModel.canActivate(organization.id);

                    expect(result).toEqual({redirect: "404"});
                
                })().then(done));
            });
        });

        describe('when user doesnt have academy access', () => {
            
            beforeEach(() => {
                spyOn(userContext, 'hasAcademyAccess').and.returnValue(false);
            });

            it('should return redirect 404', done => (async () => {
                let result = await viewModel.canActivate(organization.id);

                expect(result).toEqual({redirect: "404"});
                
            })().then(done));

        });
    });

    describe('activate:', () => {
        it('should set isInviteUsersDialogShown to false', done => (async () => {
            spyOn(getOrganizationCommand, 'execute').and.returnValue(Promise.resolve(organization));
            spyOn(getOrganizationUsersCommand, 'execute').and.returnValue(Promise.resolve([]));
                
            await viewModel.activate(organization.id);
                
            expect(viewModel.isInviteUsersDialogShown()).toBeFalsy();
                
        })().then(done));

        describe('and when organization received', () => {
            beforeEach(() => {
                spyOn(getOrganizationCommand, 'execute').and.returnValue(Promise.resolve(organization));
            });
           
            it('should set organizationId', done => (async () => {
                spyOn(getOrganizationUsersCommand, 'execute').and.returnValue(Promise.resolve([]));
                
                await viewModel.activate(organization.id);
                
                expect(viewModel.organizationId).toBe(organization.id);
                
            })().then(done));

            it('should set title', done => (async () => {
                spyOn(getOrganizationUsersCommand, 'execute').and.returnValue(Promise.resolve([]));
                
                await viewModel.activate(organization.id);
                
                expect(viewModel.title).toBeDefined();
                
            })().then(done));

            describe('and when organization users received', () => {
                beforeEach(() => {
                    spyOn(getOrganizationUsersCommand, 'execute').and.returnValue(Promise.resolve([organizationAdmin, organizationUser]));
                });

                it('should fill in users collection', done => (async () => {
                    viewModel.users([]);
                    await viewModel.activate(organization.id);
                
                    expect(viewModel.users().length).toBe(2);
                
                })().then(done));

                it('should sort users', done => (async () => {
                    await viewModel.activate(organization.id);
                
                    expect(viewModel.users()[0].id).toBe(organizationAdmin.id);
                    expect(viewModel.users()[1].id).toBe(organizationUser.id);
                
                })().then(done));

                it('should scubscribe to organization user removed event', done => (async () => {
                    await viewModel.activate(organization.id);
                
                    expect(app.on).toHaveBeenCalledWith(constants.messages.organization.userRemoved + organization.id, jasmine.any(Function));
                
                })().then(done));

                it('should scubscribe to organization user added event', done => (async () => {
                    await viewModel.activate(organization.id);
                
                    expect(app.on).toHaveBeenCalledWith(constants.messages.organization.usersAdded + organization.id, jasmine.any(Function));
                
                })().then(done));

                it('should scubscribe to invite organization users dialog closed event', done => (async () => {
                    inviteOrganizationUsersDialog.on = jasmine.createSpy('on');
                    await viewModel.activate(organization.id);
                
                    expect(inviteOrganizationUsersDialog.on).toHaveBeenCalledWith(constants.dialogs.dialogClosed, jasmine.any(Function));
                
                })().then(done));
            });

            describe('and when failed to get organization users', () => {
                beforeEach(() => {
                    spyOn(getOrganizationUsersCommand, 'execute').and.returnValue(Promise.reject('reason'));
                });

                it('should set redirect 404', done => (async () => {
                    await viewModel.activate(organization.id);

                })().catch(() => {
                    expect(router.activeItem.settings.lifecycleData).toEqual({ redirect: '404' });
                    done();
                }));

                it('should reject promise', done => (async () => {
                    await viewModel.activate(organization.id);

                })().catch(reason => {
                    expect(reason).toBeDefined();
                    done();
                }));           
            });
        });

        describe('and when failed to get organization', () => {
            beforeEach(() => {
                spyOn(getOrganizationCommand, 'execute').and.returnValue(Promise.reject('reason'));
                
            });

            it('should set redirect 404', done => (async () => {
                await viewModel.activate(organization.id);

            })().catch(() => {
                expect(router.activeItem.settings.lifecycleData).toEqual({ redirect: '404' });
                done();
            }));    

            it('should reject promise', done => (async () => {
                await viewModel.activate(organization.id);

            })().catch(reason => {
                expect(reason).toBeDefined();
                done();
            })); 
        });
    });

    describe('deactivate:', () => {
        beforeEach(() => {
            viewModel.organizationId = organization.id;
        });

        it('should unscubscribe from organization user removed event', () => {
            viewModel.deactivate();

            expect(app.off).toHaveBeenCalledWith(constants.messages.organization.userRemoved + organization.id, jasmine.any(Function));
        });

        it('should unscubscribe from organization user added event', () => {
            viewModel.deactivate();

            expect(app.off).toHaveBeenCalledWith(constants.messages.organization.usersAdded + organization.id, jasmine.any(Function));
        });


        it('should unscubscribe from invite organization users dialog closed event', () => {
            inviteOrganizationUsersDialog.off = jasmine.createSpy();
            viewModel.deactivate();
            
            expect(inviteOrganizationUsersDialog.off).toHaveBeenCalledWith(constants.dialogs.dialogClosed, jasmine.any(Function));
        });

        it('should call deactivate for each user view model', () => {
            var user1 = { deactivate: jasmine.createSpy() };
            var user2 = { deactivate: jasmine.createSpy() };
            viewModel.users([user1, user2]);

            viewModel.deactivate();

            expect(user1.deactivate).toHaveBeenCalled();
            expect(user2.deactivate).toHaveBeenCalled();
        });
    });

    describe('getTitle:', () => {
        beforeEach(() => {
            viewModel.organizationId = organization.id;
        });

        describe('and when organization received', () => {
            beforeEach(() => {
                spyOn(getOrganizationCommand, 'execute').and.returnValue(Promise.resolve(organization));
            });
           
            it('should return organization title', done => (async () => {
                let title = await viewModel.getTitle();
                
                expect(title).toBeDefined(organization.title);
                
            })().then(done));
        });

        describe('and when failed to get organization', () => {
            beforeEach(() => {
                spyOn(getOrganizationCommand, 'execute').and.returnValue(Promise.reject('reason'));
            });

            it('should reject promise', done => (async () => {
                await viewModel.getTitle();

            })().catch(reason => {
                expect(reason).toBeDefined();
                done();
            }));    
        });
    });

    describe('updateTitle', () => {
        beforeEach(() => {
            viewModel.organizationId = organization.id;
        });

        it('should publish \'Edit organization title\' event', () => {
            spyOn(updateOrganizationTitleCommand, 'execute').and.returnValue(Promise.resolve());

            viewModel.updateTitle(organization.title);
            expect(eventTracker.publish).toHaveBeenCalledWith('Edit organization title');
        });

        it('should execute command to update title', done => (async () => {
            spyOn(updateOrganizationTitleCommand, 'execute').and.returnValue(Promise.resolve());

            await viewModel.updateTitle(organization.title);

            expect(updateOrganizationTitleCommand.execute).toHaveBeenCalledWith(organization.id, organization.title);

        })().then(done));

        describe('and when failed to update organization title', () => {
            beforeEach(() => {
                spyOn(updateOrganizationTitleCommand, 'execute').and.returnValue(Promise.reject('reason'));
            });

            it('should reject promise', done => (async () => {
                await viewModel.updateTitle(organization.title);

            })().catch(reason => {
                expect(reason).toBeDefined();
                done();
            }));   
        });
    });

    describe('inviteUsers:', () => {
        beforeEach(() => {
            spyOn(inviteOrganizationUsersDialog, 'hide');
            spyOn(inviteOrganizationUsersDialog, 'show');
            viewModel.organizationId = organization.id;
        });

        describe('when invite organization users dialog is shown', () => {
            beforeEach(() => {
                viewModel.isInviteUsersDialogShown(true);
            });

            it('should hide dialog', () => {
                viewModel.inviteUsers();

                expect(inviteOrganizationUsersDialog.hide).toHaveBeenCalled();
            });

            it('should not show dialog', () => {
                viewModel.inviteUsers();

                expect(inviteOrganizationUsersDialog.show).not.toHaveBeenCalled();
            });
        });

        describe('when invite organization users dialog is not shown', () => {
            beforeEach(() => {
                viewModel.isInviteUsersDialogShown(false);
            });

            it('sholud set isInviteUsersDialogShown to true', () => {
                viewModel.isInviteUsersDialogShown(false);

                viewModel.inviteUsers();

                expect(viewModel.isInviteUsersDialogShown()).toBeTruthy();
            });

            it('should show dialog', () => {
                viewModel.inviteUsers();

                expect(inviteOrganizationUsersDialog.show).toHaveBeenCalledWith(organization.id);
            });
        });
    });

    describe('inviteUsersDialogClosed:', () => {
        it('should set isInviteUsersDialogShown to false', () => {
            viewModel.isInviteUsersDialogShown(true);

            viewModel.inviteUsersDialogClosed();

            expect(viewModel.isInviteUsersDialogShown()).toBeFalsy();
        });
    });

    describe('deleteOrganizationUser:', () => {
        beforeEach(() => {
            spyOn(removeUserDialog, 'show');
            viewModel.organizationId = organization.id;
        });

        it('should show remove organization user dialog', () => {
            var user = { email: 'email', name: () => { return 'name' } };

            viewModel.deleteOrganizationUser(user);

            expect(removeUserDialog.show).toHaveBeenCalledWith(organization.id, user.email, user.name());
        });
    });

    describe('organizationUserRemoved', () => {
        it('should remove user from users collection', () => {
            viewModel.users([organizationAdmin, organizationUser]);

            viewModel.organizationUserRemoved(organizationUser.email);

            expect(viewModel.users().length).toBe(1);
            expect(viewModel.users()[0]).toEqual(organizationAdmin);
        });
    });

    describe('organizationUsersAdded:', () => {
        var user = {
            id: 'adminId222',
            isRegistered: true,
            fullName: 'admin222',
            email: 'email2222',
            createdOn: new Date(2)
        };

        beforeEach(() => {
            viewModel.users([user]);
        });

        it('should add users to users collection', () => {
            viewModel.organizationUsersAdded([organizationAdmin, organizationUser]);

            expect(viewModel.users().length).toBe(3);
        });
    });

    describe('reinviteUser:', () => {
        let user = {
            id: 'adminId222',
            isReinviting: ko.observable(false)
        };

        beforeEach(() => {
            viewModel.organizationId = organization.id;
        });

        it('should call reinvite user command', () => {
            spyOn(reinviteUserCommand, 'execute').and.returnValue(Promise.resolve(true));

            viewModel.reinviteUser(user);

            expect(reinviteUserCommand.execute).toHaveBeenCalledWith(organization.id ,user.id);
        });

        it('should set user isReinviting to true', () => {
            spyOn(reinviteUserCommand, 'execute').and.returnValue(Promise.resolve(true));
            user.isReinviting(false);

            viewModel.reinviteUser(user);

            expect(user.isReinviting()).toBeTruthy();
        });

        describe('and when user reinvited successfully', () => {
            beforeEach(() => {
                spyOn(reinviteUserCommand, 'execute').and.returnValue(Promise.resolve());
            });

            it('should set user isReinviting to false', done => (async () => {
                user.isReinviting(true);
                await viewModel.reinviteUser(user);

                expect(user.isReinviting()).toBeFalsy();

            })().then(done));

            it('should show notification success message', done => (async () => {
                await viewModel.reinviteUser(user);

                expect(notify.success).toHaveBeenCalledWith('invitesHaveBeenSucessfullySent');

            })().then(done));
        });

        describe('and when failed to reinvite user', () => {
            beforeEach(() => {
                spyOn(reinviteUserCommand, 'execute').and.returnValue(Promise.reject());
            });

            it('should set user isReinviting to false', done => (async () => {
                user.isReinviting(true);
                await viewModel.reinviteUser(user);

                expect(user.isReinviting()).toBeFalsy();

            })().then(done));
        });
    });
});