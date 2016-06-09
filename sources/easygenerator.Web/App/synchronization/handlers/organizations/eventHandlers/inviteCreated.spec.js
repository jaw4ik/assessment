import handler from './inviteCreated';

import app from 'durandal/app';
import constants from 'constants';
import organizationInviteMapper from 'mappers/organizationInviteMapper';
import userContext from 'userContext';

describe('synchronization organizations [inviteCreated]', () => {
    let organizationInviteData = {Id: 'id'},
        organizationInvite = {id:organizationInviteData.Id};

    beforeEach(() => {
        spyOn(app, 'trigger');
        spyOn(organizationInviteMapper, 'map').and.returnValue(organizationInvite);
        userContext.identity = {
            organizationInvites: []
        };
    });

    describe('when organizationInvite is not an object', () => {

        it('should throw exception', () => {
            var f = () => {
                handler(null);
            };
            expect(f).toThrow('organizationInvite is not an object');
        });

    });

    it('should push invite to user context', () => {
        handler(organizationInviteData);

        expect(userContext.identity.organizationInvites.length).toBe(1);
        expect(userContext.identity.organizationInvites[0]).toBe(organizationInvite);
    });

    it('should trigger app event', () => {
        handler(organizationInviteData);

        expect(app.trigger).toHaveBeenCalledWith(constants.messages.organization.inviteCreated, organizationInvite);
    });
});
