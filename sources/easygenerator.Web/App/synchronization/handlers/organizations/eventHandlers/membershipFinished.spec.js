import handler from './membershipFinished';

import app from 'durandal/app';
import constants from 'constants';
import userContext from 'userContext';

describe('synchronization organizations [membershipFinished]', () => {
    let organizationId = 'id';

    beforeEach(() => {
        spyOn(app, 'trigger');
        userContext.identity = {
            organizations: [{id:organizationId}]
        };
    });

    describe('when organizationId is not a string', () => {

        it('should throw exception', () => {
            var f = () => {
                handler(null);
            };
            expect(f).toThrow('organizationId is not a string');
        });

    });

    it('should remove organization from organizations collection in user context', () => {
        handler(organizationId);
        
        expect(userContext.identity.organizations.length).toBe(0);
    });

    it('should trigger app event', () => {
        handler(organizationId);

        expect(app.trigger).toHaveBeenCalledWith(constants.messages.organization.membershipFinished, organizationId);
    });
});
