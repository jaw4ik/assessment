import handler from './inviteAccepted';

import app from 'durandal/app';
import constants from 'constants';

describe('synchronization organizations [inviteAccepted]', () => {
    let organizationUserId = 'id';
    
    beforeEach(() => {
        spyOn(app, 'trigger');
    });

    describe('when organizationUserId is not an object', () => {

        it('should throw exception', () => {
            var f = () => {
                handler(null);
            };
            expect(f).toThrow('organizationUserId is not a string');
        });

    });

    it('should trigger app event', () => {
        handler(organizationUserId);

        expect(app.trigger).toHaveBeenCalledWith(constants.messages.organization.userStatusUpdated + organizationUserId, constants.organizationUserStatus.accepted);
    });
});
