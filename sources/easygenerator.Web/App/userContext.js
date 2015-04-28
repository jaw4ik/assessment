define(['durandal/app', 'constants', 'models/user'], function (app, constants, User) {


    var userContext = {
        identity: null,
        hasStarterAccess: hasStarterAccess,
        hasPlusAccess: hasPlusAccess,
        identify: identify
    };

    return userContext;

    function identify() {
        return Q($.ajax({
            url: 'api/identify',
            type: 'POST',
            contentType: 'application/json',
            dataType: 'json'
        })).then(function (user) {
            userContext.identity = _.isString(user.email) ? new User(user) : null;
            app.trigger(constants.messages.user.identified, userContext.identity);
        });
    }

    function hasStarterAccess() {
        return hasAccess(constants.accessType.starter);
    }

    function hasPlusAccess() {
        return hasAccess(constants.accessType.plus);
    }

    function hasAccess(accessType) {
        if (accessType === constants.accessType.free) {
            return true;
        }

        var identity = userContext.identity;
        if (_.isNullOrUndefined(identity) || _.isNullOrUndefined(identity.subscription)) {
            return false;
        }

        var subscription = identity.subscription;
        return subscription.accessType >= accessType && subscription.expirationDate >= new Date();
    }
})