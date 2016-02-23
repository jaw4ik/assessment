import handler from './inviteRemoved';

import app from 'durandal/app';
import constants from 'constants';

describe('synchronization collaboration [inviteRemoved]', function () {

    beforeEach(function () {
        spyOn(app, 'trigger');
    });


    it('should be function', function () {
        expect(handler).toBeFunction();
    });

    describe('when inviteId is not a string', function () {
        it('should throw an exception', function () {
            var f = function () {
                handler(undefined);
            };

            expect(f).toThrow('InviteId is not a string');
        });
    });

    it('should trigger app event', function () {
        var inviteId = 'id';
        handler(inviteId);
        expect(app.trigger).toHaveBeenCalledWith(constants.messages.course.collaboration.inviteRemoved, inviteId);
    });
});
