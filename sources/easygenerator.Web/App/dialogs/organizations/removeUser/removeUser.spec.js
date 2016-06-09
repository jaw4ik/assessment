import viewModel from 'dialogs/organizations/removeUser/removeUser';

import dialog from 'widgets/dialog/viewmodel';
import removeOrganizationUserCommand from 'organizations/commands/removeUser';
import notify from 'notify';
import localizationManager from 'localization/localizationManager';
import eventTracker from 'eventTracker';

describe('dialogs organizations [removeUser]', () => {
    let organizationId = 'organizationId',
        userEmail = 'email',
        userName = 'name';

    beforeEach(() => {
        spyOn(dialog, 'show');
        spyOn(dialog, 'close');
        spyOn(notify, 'error');
        spyOn(eventTracker, 'publish');
        spyOn(localizationManager, 'localize').and.callFake(arg => { return arg; });
    });

    describe('isRemoving:', () => {
        it('should be observable', () => {
            expect(viewModel.isRemoving).toBeObservable();
        });
    });

    describe('show:', () => {
        it('should set organizationId', () => {
            viewModel.organizationId = null;

            viewModel.show(organizationId, userEmail, userName);

            expect(viewModel.organizationId).toBe(organizationId);
        });

        it('should set userEmail', () => {
            viewModel.userEmail = null;

            viewModel.show(organizationId, userEmail, userName);

            expect(viewModel.userEmail).toBe(userEmail);
        });

        it('should set userName', () => {
            viewModel.userName = null;

            viewModel.show(organizationId, userEmail, userName);

            expect(viewModel.userName).toBe(userName);
        });

        it('should set isremoving to false', () => {
            viewModel.isRemoving(true);

            viewModel.show(organizationId, userEmail, userName);

            expect(viewModel.isRemoving()).toBeFalsy();
        });

        it('should show dialog', () => {
            viewModel.show(organizationId, userEmail, userName);

            expect(dialog.show).toHaveBeenCalled();
        });
    });

    describe('cancel:', () => {
        it('should close dialog', () => {
            viewModel.cancel();

            expect(dialog.close).toHaveBeenCalled();
        });
    });

    describe('removeUser:', () => {
        beforeEach(() => {
            viewModel.organizationId = organizationId;
            viewModel.userEmail = userEmail;
        });

        it('should publish \'Remove user from organization\' event', () => {
            spyOn(removeOrganizationUserCommand, 'execute');
            viewModel.removeUser();

            expect(eventTracker.publish).toHaveBeenCalledWith('Remove user from organization');
        });

        it('should set isRemoving to true', () => {
            spyOn(removeOrganizationUserCommand, 'execute');
            viewModel.isRemoving(false);

            viewModel.removeUser();

            expect(viewModel.isRemoving()).toBeTruthy();
        });

        describe('when user removed', () => {
            beforeEach(() => {
                spyOn(removeOrganizationUserCommand, 'execute').and.returnValue(Promise.resolve());
            });
           
            it('should set isRemoving to false', done => (async () => {
                viewModel.isRemoving(true);
                await viewModel.removeUser();
                
                expect(viewModel.isRemoving()).toBeFalsy();
                
            })().then(done));

            it('should close dialog', done => (async () => {
                await viewModel.removeUser();
                
                expect(dialog.close).toHaveBeenCalled();
                
            })().then(done));
        });

        describe('when failed to remove user', () => {
            beforeEach(() => {
                spyOn(removeOrganizationUserCommand, 'execute').and.returnValue(Promise.reject());
            });
            
            it('should show notification', done => (async () => {
                await viewModel.removeUser();
                
                expect(notify.error).toHaveBeenCalledWith('responseFailed');
                
            })().then(done));

            it('should set isRemoving to false', done => (async () => {
                viewModel.isRemoving(true);
                await viewModel.removeUser();
                
                expect(viewModel.isRemoving()).toBeFalsy();
                
            })().then(done));
  
        });
    });

});