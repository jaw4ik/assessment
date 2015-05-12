define(['guard', 'durandal/app', 'constants'],
    function (guard, app, constants) {
        "use strict";

        return function (inviteId) {
            guard.throwIfNotString(inviteId, 'InviteId is not a string');

            app.trigger(constants.messages.course.collaboration.inviteRemoved, inviteId);
        }
    });