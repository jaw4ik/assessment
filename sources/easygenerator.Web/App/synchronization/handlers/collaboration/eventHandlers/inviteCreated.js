define(['guard', 'durandal/app', 'constants'],
    function (guard, app, constants) {
        "use strict";

        return function (invite) {
            guard.throwIfNotAnObject(invite, 'Invite is not an object');

            app.trigger(constants.messages.course.collaboration.inviteCreated, invite);
        }
    });