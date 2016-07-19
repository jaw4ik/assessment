import handler from './titleUpdated';

import app from 'durandal/app';
import constants from 'constants';
import userContext from 'userContext';

describe('synchronization organizations [organizationTitleUpdated]', () => {
    let organizationId = 'id',
        title = 'title',
        organization;
    
    beforeEach(() => {
        spyOn(app, 'trigger');
        organization = { id: organizationId, title: '' };
    });

    describe('when organizationId is not string', () => {

        it('should throw exception', () => {
            var f = () => {
                handler(null, title);
            };
            expect(f).toThrow('organizationId is not a string');
        });

    });

    describe('when title is not string', () => {

        it('should throw exception', () => {
            var f = () => {
                handler(organizationId, null);
            };
            expect(f).toThrow('organizationTitle is not a string');
        });

    });

    it('should update user context organization',  () => {
        userContext.identity = { organizations: [organization] };

        handler(organizationId, title);
                
        expect(userContext.identity.organizations[0].title).toBe(title);
                
    });

    it('should trigger app event', () => {
        handler(organizationId, title);

        expect(app.trigger).toHaveBeenCalledWith(constants.messages.organization.titleUpdated, organizationId, title);
    });
});
