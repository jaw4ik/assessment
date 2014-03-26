﻿define(['constants', 'models/user'], function (constants, User) {


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
        var identity = userContext.identity;
        if (_.isNullOrUndefined(identity) || _.isNullOrUndefined(identity.subscription)) {
            return false;
        }

        var subscription = identity.subscription;
        return subscription.accessType === constants.accessType.starter && subscription.expirationDate >= new Date();
    }

})