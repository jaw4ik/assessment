import handler from './userRegistered';

import app from 'durandal/app';
import constants from 'constants';

describe('synchronization organizations [organizationUserRegistered]', () => {
    beforeEach(() => {
        spyOn(app, 'trigger');
    });

    describe('when email is not string', () => {

        it('should throw exception', () => {
            var f = () => {
                handler();
            };
            expect(f).toThrow('email is not a string');
        });

    });

    describe('when fullName is not string', () => {

        it('should throw exception', () => {
            var f = () => {
                handler('email');
            };
            expect(f).toThrow('fullName is not a string');
        });

    });

    it('should trigger app event', () => {
        handler('email', 'fullName');

        expect(app.trigger).toHaveBeenCalledWith(constants.messages.organization.userRegistered + 'email', { fullName: 'fullName' });
    });
});
