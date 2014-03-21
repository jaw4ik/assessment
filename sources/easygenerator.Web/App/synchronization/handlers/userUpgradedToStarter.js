define(['guard', 'userContext'], function (guard, userContext) {
    return function (expirationDate) {
        guard.throwIfNotAnObject(userContext.identity, "User identity is not an object");
        userContext.identity.upgradeToStarter(expirationDate);
        console.log('User was upgraded to starter plan (expires on ' + expirationDate + ')');
    };
});