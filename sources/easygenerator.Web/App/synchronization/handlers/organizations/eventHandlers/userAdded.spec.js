import handler from './userAdded';

import app from 'durandal/app';
import constants from 'constants';
import organizationUserMapper from 'mappers/organizationUserMapper';

describe('synchronization organizations [userAdded]', () => {
    let organizationId = 'id',
        userData = {},
        user = {};
    
    beforeEach(() => {
        spyOn(app, 'trigger');
    });

    describe('when organizationId is not string', () => {

        it('should throw exception', () => {
            var f = () => {
                handler(null, userData);
            };
            expect(f).toThrow('Organization id is not a string');
        });

    });

    describe('when user is not an object', () => {

        it('should throw exception', () => {
            var f = () => {
                handler(organizationId, null);
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

        expect(app.trigger).toHaveBeenCalledWith(constants.messages.organization.usersAdded + organizationId, [user]);
    });
});
