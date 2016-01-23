define(['guard', 'userContext', 'durandal/app', 'constants'], function (guard, userContext, app, constants) {
    "use strict";

    return function() {
        guard.throwIfNotAnObject(userContext.identity, "User identity is not an object");
        userContext.identity.downgrade();
        app.trigger(constants.messages.user.downgraded);
        app.trigger(constants.messages.user.planChanged);
    };
});