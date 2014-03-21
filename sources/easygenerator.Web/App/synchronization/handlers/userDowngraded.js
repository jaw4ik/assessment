define(['guard', 'userContext'], function (guard, userContext) {
    return function () {
        guard.throwIfNotAnObject(userContext.identity, "User identity is not an object");
        userContext.identity.downgrade();
    };
});