import handler from './inviteRemoved';

import app from 'durandal/app';
import constants from 'constants';

describe('synchronization organizations [organizationInviteRemoved]', () => {
    let organizationUserId = 'id';
    
    beforeEach(() => {
        spyOn(app, 'trigger');
    });

    describe('when organizationUserId is not string', () => {

        it('should throw exception', () => {
            var f = () => {
                handler(null);
            };
            expect(f).toThrow('organizationUserId is not a string');
        });

    });


    it('should trigger app event', () => {
        handler(organizationUserId);

        expect(app.trigger).toHaveBeenCalledWith(constants.messages.organization.inviteRemoved, organizationUserId);
    });
});
