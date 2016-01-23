define(['guard', 'userContext', 'durandal/app', 'constants'], function (guard, userContext, app, constants) {
    "use strict";

    return function (expirationDate) {
        guard.throwIfNotAnObject(userContext.identity, "User identity is not an object");
        userContext.identity.upgradeToPlus(expirationDate);
        app.trigger(constants.messages.user.upgradedToPlus);
        app.trigger(constants.messages.user.planChanged);
    }

});