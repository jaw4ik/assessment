define(['constants', 'models/user'], function (constants, User) {


    var userContext = {
        identity: null,
        hasStarterAccess: hasStarterAccess,
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
        });
    }

    function hasStarterAccess() {
        if (_.isNullOrUndefined(userContext.identity) || _.isNullOrUndefined(userContext.identity.subscription)) {
            return false;
        }

        return userContext.identity.subscription.accessType === constants.accessType.starter;
    }

})