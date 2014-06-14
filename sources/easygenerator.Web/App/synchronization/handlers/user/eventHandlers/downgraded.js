﻿define(['guard', 'userContext', 'durandal/app', 'constants'], function (guard, userContext, app, constants) {

    return function() {
        guard.throwIfNotAnObject(userContext.identity, "User identity is not an object");
        userContext.identity.downgrade();
        app.trigger(constants.messages.user.downgraded);
    };
});