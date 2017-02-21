import handler from './membershipUpdated';

import app from 'durandal/app';
import constants from 'constants';
import userContext from 'userContext';

describe('synchronization organizations [membershipUpdated]', () => {
    let organizationId = 'organizationId',
        userData = { IsAdmin: true };

    beforeEach(() => {
        spyOn(app, 'trigger');
        userContext.identity = {
            organizations: [ { id: organizationId, grantsAdminAccess: false }]
        };
    });

    describe('when organization is not a string', () => {

        it('should throw exception', () => {
            var f = () => {
                handler();
            };
            expect(f).toThrow('Organization id is not a string');
        });

    });

    describe('when user is not an object', () => {

        it('should throw exception', () => {
            var f = () => {
                handler(organizationId);
            };
            expect(f).toThrow('User is not an object');
        });

    });

    it('should update grantsAdminAccess', () => {
        handler(organizationId, userData);
        expect(userContext.identity.organizations[0].grantsAdminAccess).toBeTruthy();
    });

    it('should trigger app event', () => {
        handler(organizationId, userData);
        expect(app.trigger).toHaveBeenCalledWith(constants.messages.organization.membershipUpdated, organizationId);
    });
});
