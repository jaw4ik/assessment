import handler from './userUpdated';

import app from 'durandal/app';
import constants from 'constants';
import userContext from 'userContext';
import organizationUserMapper from 'mappers/organizationUserMapper';

describe('synchronization organizations [userUpdated]', () => {
    let organizationId = 'organizationId',
        userData = { IsAdmin: true },
        user = { id: 'id'};

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

    it('should map organization user', () => {
        spyOn(organizationUserMapper, 'map');

        handler(organizationId, userData);
        expect(organizationUserMapper.map).toHaveBeenCalledWith(userData);
    });

    it('should trigger app event', () => {
        spyOn(organizationUserMapper, 'map').and.returnValue(user);
        
        handler(organizationId, userData);
        expect(app.trigger).toHaveBeenCalledWith(constants.messages.organization.userUpdated + organizationId, user);
    });
});
