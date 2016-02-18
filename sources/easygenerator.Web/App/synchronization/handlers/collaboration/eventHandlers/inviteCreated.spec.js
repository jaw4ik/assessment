import handler from './inviteCreated';

import app from 'durandal/app';
import constants from 'constants';

describe('synchronization collaboration [inviteCreated]', function () {

    beforeEach(function () {
        spyOn(app, 'trigger');
    });


    it('should be function', function () {
        expect(handler).toBeFunction();
    });

    describe('when invite is not an object', function () {
        it('should throw an exception', function () {
            var f = function () {
                handler(undefined);
            };

            expect(f).toThrow('Invite is not an object');
        });
    });

    it('should trigger app event', function () {
        var invite = {};
        handler(invite);
        expect(app.trigger).toHaveBeenCalledWith(constants.messages.course.collaboration.inviteCreated, invite);
    });
});
