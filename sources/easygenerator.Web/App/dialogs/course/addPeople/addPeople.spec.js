import viewModel from 'dialogs/organizations/inviteUsers/inviteUsers';

import constants from 'constants';
import addUsersCommand from 'organizations/commands/addUsers';
import notify from 'notify';
import localizationManager from 'localization/localizationManager';
import eventTracker from 'eventTracker';

describe('dialogs organizations [inviteUsers]', () => {
    let organizationId = 'organizationId',
        userEmail = 'email',
        userName = 'name';

    beforeEach(() => {
        spyOn(notify, 'error');
        spyOn(eventTracker, 'publish');
        spyOn(localizationManager, 'localize').and.callFake(arg => { return arg; });
    });

    describe('isShown:', () => {
        it('should be observable', () => {
            expect(viewModel.isShown).toBeObservable();
        });
    });

    describe('isProcessing:', () => {
        it('should be observable', () => {
            expect(viewModel.isProcessing).toBeObservable();
        });
    });

    describe('isValid:', () => {
        it('should be observable', () => {
            expect(viewModel.isValid).toBeObservable();
        });
    });

    describe('emails:', () => {
        it('should be observable array', () => {
            expect(viewModel.emails).toBeObservableArray();
        });
    });

    describe('show:', () => {
        it('should publish \'Open \'invite users\' dialog\' event', () => {
            viewModel.show(organizationId);

            expect(eventTracker.publish).toHaveBeenCalledWith('Open \'invite users\' dialog');
        });

        it('should set organizationId', () => {
            viewModel.organizationId = null;

            viewModel.show(organizationId);

            expect(viewModel.organizationId).toBe(organizationId);
        });

        it('should set isValid to true', () => {
            viewModel.isValid(false);

            viewModel.show(organizationId);

            expect(viewModel.isValid()).toBeTruthy();
        });

        it('should set isProcessing to false', () => {
            viewModel.isProcessing(true);

            viewModel.show(organizationId);

            expect(viewModel.isProcessing()).toBeFalsy();
        });

        it('should isShown to true', () => {
            viewModel.isShown(false);

            viewModel.show(organizationId);

            expect(viewModel.isShown()).toBeTruthy();
        });
    
        it('should set emails to empty', () => {
            viewModel.emails(['someValue']);

            viewModel.show(organizationId);

            expect(viewModel.emails().length).toBe(0);
        });
    });

    describe('hide:', () => {
        it('should isShown to false', () => {
            viewModel.isShown(true);

            viewModel.hide();

            expect(viewModel.isShown()).toBeFalsy();
        });

        it('should trigger dialog closed event', () => {
            viewModel.trigger = () => {};
            spyOn(viewModel, 'trigger');

            viewModel.hide();

            expect(viewModel.trigger).toHaveBeenCalledWith(constants.dialogs.dialogClosed);
        });
    });

    describe('submit:', () => {
        beforeEach(() => {
            viewModel.organizationId = organizationId;
        });

        describe('when emails array doesnt have any items', () => {
            beforeEach(() => {
                viewModel.emails([]);
                spyOn(addUsersCommand, 'execute').and.returnValue(Promise.resolve());
            });

            it('should not publish \'Invite user(s) to an organization\' event', () => {
                viewModel.submit();

                expect(eventTracker.publish).not.toHaveBeenCalledWith('Invite user(s) to an organization');
            });

            it('should not call invite users command', () => {
                viewModel.submit();

                expect(addUsersCommand.execute).not.toHaveBeenCalled();
            });

            it('should set isValid to false', () => {
                viewModel.isValid(true);

                viewModel.submit();

                expect(viewModel.isValid()).toBeFalsy();
            });
        });

        describe('when emails array has items', () => {
            beforeEach(() => {
                viewModel.emails([userEmail]);
            });

            it('should publish \'Invite user(s) to an organization\' event', () => {
                spyOn(addUsersCommand, 'execute').and.returnValue(Promise.resolve());
                viewModel.submit();

                expect(eventTracker.publish).toHaveBeenCalledWith('Invite user(s) to an organization');
            });

            it('should set isProcessing to true', () => {
                spyOn(addUsersCommand, 'execute').and.returnValue(Promise.resolve());
                viewModel.isProcessing(false);

                viewModel.submit();

                expect(viewModel.isProcessing()).toBeTruthy();
            });

            describe('and when users added', () => {
                beforeEach(() => {
                    spyOn(addUsersCommand, 'execute').and.returnValue(Promise.resolve());
                });
           
                it('should set isProcessing to false', done => (async () => {
                    viewModel.isProcessing(true);
                    await viewModel.submit();
                
                    expect(viewModel.isProcessing()).toBeFalsy();
                
                })().then(done));

                it('should hide dialog', done => (async () => {
                    spyOn(viewModel, 'hide');
                    await viewModel.submit();
                
                    expect(viewModel.hide).toHaveBeenCalled();
                
                })().then(done));
            });

            describe('and when failed to remove user', () => {
                beforeEach(() => {
                    spyOn(addUsersCommand, 'execute').and.returnValue(Promise.reject('reason'));
                });

                it('should set isProcessing to false', done => (async () => {
                    viewModel.isProcessing(true);

                    await viewModel.submit();
                })().catch(() => {
                    expect(viewModel.isProcessing()).toBeFalsy();
                    done();
                })); 

                it('should show notification', done => (async () => {
                    viewModel.isProcessing(true);

                    await viewModel.submit();
                })().catch(() => {
                    expect(notify.error).toHaveBeenCalledWith('responseFailed');
                    done();
                })); 
            });
        });
    });

});