define(['durandal/system', 'synchronization/handlers/userDowngraded', 'synchronization/handlers/userUpgradedToStarter'], function (system, userDowngraded, userUpgradedToStarter) {

    return {
        start: function () {
            var dfd = Q.defer();

            var user = $.connection.user;

            user.client = {
                userDowngraded: userDowngraded,
                userUpgradedToStarter: userUpgradedToStarter
            };

            $.connection.hub.start()
                .done(function () {
                    system.log("Synchronization with server was established");
                    dfd.resolve();
                }).fail(function () {
                    dfd.reject('Could not establish synchronization with server');
                });

            return dfd.promise;
        }
    };
})