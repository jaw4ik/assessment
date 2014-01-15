define(['constants'], function (constants) {


    var userContext = {
        identity: null,
        hasStarterAccess: hasStarterAccess,
        initialize: initialize
    };

    return userContext;

    function initialize() {
        var deferred = Q.defer();

        $.ajax({ url: 'api/user_post', type: 'POST', contentType: 'application/json', dataType: 'json' }).done(function (user) {
            userContext.identity = {
                username: user.username,
                email: user.email,
                accessType: _.find(constants.accessType, function (item) { return item == user.accessType; })
            };

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