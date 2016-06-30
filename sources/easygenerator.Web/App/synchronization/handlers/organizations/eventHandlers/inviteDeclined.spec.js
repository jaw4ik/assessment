import handler from './inviteDeclined';

import app from 'durandal/app';
import constants from 'constants';

describe('synchronization organizations [inviteDeclined]', () => {
    let organizationId = 'orgId',
        organizationUserId = 'id';
    
    beforeEach(() => {
        spyOn(app, 'trigger');
    });

    describe('when organizationId is not string', () => {

        it('should throw exception', () => {
            var f = () => {
                handler(null, organizationUserId);
            };
            expect(f).toThrow('organizationId is not a string');
        });

    });

    describe('when organizationUserId is not string', () => {

        it('should throw exception', () => {
            var f = () => {
                handler(organizationId, null);
            };
            expect(f).toThrow('organizationUserId is not a string');
        });

    });

    it('should trigger app event', () => {
        handler(organizationId, organizationUserId);

        expect(app.trigger).toHaveBeenCalledWith(constants.messages.organization.userStatusUpdated + organizationUserId, constants.organizationUserStatus.declined);
    });
});
