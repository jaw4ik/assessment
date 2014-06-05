define(['guard', 'userContext', 'durandal/app', 'constants'], function (guard, userContext, app, constants) {

    return {
        userUpgradedToStarter: userUpgradedToStarter,
        userDowngraded: userDowngraded
    }

    function userUpgradedToStarter(expirationDate) {
        guard.throwIfNotAnObject(userContext.identity, "User identity is not an object");
        userContext.identity.upgradeToStarter(expirationDate);
        app.trigger(constants.messages.user.upgraded);
    }

    function userDowngraded() {
        guard.throwIfNotAnObject(userContext.identity, "User identity is not an object");
        userContext.identity.downgrade();
        app.trigger(constants.messages.user.downgraded);
    };
});