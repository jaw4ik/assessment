import handler from './membershipStarted';

import app from 'durandal/app';
import constants from 'constants';
import organizationMapper from 'mappers/organizationMapper';
import userContext from 'userContext';

describe('synchronization organizations [membershipStarted]', () => {
    let organizationData = { Id: 'id'},
        organization = { id: organizationData.Id};

    beforeEach(() => {
        spyOn(app, 'trigger');
        spyOn(organizationMapper, 'map').and.returnValue(organization);
        userContext.identity = {
            organizations: []
        };
    });

    describe('when organization is not an object', () => {

        it('should throw exception', () => {
            var f = () => {
                handler(null);
            };
            expect(f).toThrow('organizationData is not an object');
        });

    });

    it('should add organization to organizations collection in user context', () => {
        handler(organizationData);
        
        expect(userContext.identity.organizations.length).toBe(1);
        expect(userContext.identity.organizations[0]).toBe(organization);
    });

    it('should trigger app event', () => {
        handler(organizationData);

        expect(app.trigger).toHaveBeenCalledWith(constants.messages.organization.membershipStarted, organization);
    });
});
