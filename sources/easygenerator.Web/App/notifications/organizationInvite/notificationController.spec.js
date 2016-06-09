import controller from './notificationController';

import getInvitesCommand from './commands/getInvites';
import userContext from 'userContext';
import constants from 'constants';
import app from 'durandal/app';

describe('organization invite [notificationController]', () => {
    var firstname = 'user';

    beforeEach(() => {
        userContext.identity = { firstname: firstname };
        userContext.identity.subscription = {};
        spyOn(app, 'on');
        spyOn(app, 'trigger');
    });

    describe('execute:', () => {
        var organizationUserId = 'userId',
            organizationId = 'id';

        it('should subscribe on organization invite created event', () => {
            controller.execute();
            expect(app.on).toHaveBeenCalledWith(constants.messages.organization.inviteCreated, jasmine.any(Function));
        });

        it('should subscribe on organization invite removed event', () => {
            controller.execute();
            expect(app.on).toHaveBeenCalledWith(constants.messages.organization.inviteRemoved, jasmine.any(Function));
        });

        it('should send request to get invites', done => (async () => {
            spyOn(getInvitesCommand, 'execute').and.returnValue(Promise.resolve([]));
                
            await controller.execute();
                
            expect(getInvitesCommand.execute).toHaveBeenCalled();
                
        })().then(done));

        describe('and when received invites', () => {
            let invites = [{}, {}];

            beforeEach(() => {
                spyOn(getInvitesCommand, 'execute').and.returnValue(Promise.resolve(invites));
                spyOn(controller, 'pushNotification');
            });
            
            it('should push invites notifications', done => (async () => {
                await controller.execute();
                
                expect(controller.pushNotification).toHaveBeenCalledWith(invites[0]);
                expect(controller.pushNotification).toHaveBeenCalledWith(invites[1]);
                
            })().then(done));
        });
    });

    describe('pushNotification:', () => {
        var invite = {
            id: '0',
            organizationId: '1',
            organizationAdminFirstName: 'Ann',
            organizationAdminLastName: 'Qqq',
            organizationTitle: 'titile'
        };

        it('should push notification', () => {
            controller.pushNotification(invite);

            expect(app.trigger).toHaveBeenCalled();
            expect(app.trigger.calls.mostRecent().args[0]).toBe(constants.notification.messages.push);
            expect(app.trigger.calls.mostRecent().args[1].key).toBe(constants.notification.keys.organizationInvite + invite.id);
            expect(app.trigger.calls.mostRecent().args[1].userFirstname).toBe(firstname);
            expect(app.trigger.calls.mostRecent().args[1].organizationAdminFirstname).toBe(invite.organizationAdminFirstName);
            expect(app.trigger.calls.mostRecent().args[1].organizationAdminLastname).toBe(invite.organizationAdminLastName);
            expect(app.trigger.calls.mostRecent().args[1].organizationTitle()).toBe(invite.organizationTitle);
        });
    });

    describe('removeNotification:', () => {
        var id = 'id';

        it('should remove notification', () => {
            controller.removeNotification(id);

            expect(app.trigger).toHaveBeenCalled();
            expect(app.trigger.calls.mostRecent().args[0]).toBe(constants.notification.messages.remove);
            expect(app.trigger.calls.mostRecent().args[1]).toBe(constants.notification.keys.organizationInvite + id);
        });
    });
});
