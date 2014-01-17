define(['constants'], function (constants) {


    var userContext = {
        identity: null,
        hasStarterAccess: hasStarterAccess,
        identify: identify
    };

    return userContext;

    function identify() {
        var deferred = Q.defer();

        $.ajax({ url: 'api/identify', type: 'POST', contentType: 'application/json', dataType: 'json' }).done(function (user) {
            if (_.isString(user.email)) {
                userContext.identity = {
                    email: user.email,
                    fullname: user.fullname,
                    accessType: _.find(constants.accessType, function (item) { return item == user.accessType; })
                };
            } else {
                userContext.identity = null;
            }

            deferred.resolve();

        }).fail(function () {
            deferred.reject();
        });

        return deferred.promise;
    }

    function hasStarterAccess() {
        if (_.isNullOrUndefined(userContext.identity)) {
            return false;
        }

        return userContext.identity.accessType == constants.accessType.starter;

    }
})