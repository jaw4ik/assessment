define(['durandal/system', 'synchronization/handlers/userDowngraded', 'synchronization/handlers/userUpgradedToStarter', 'synchronization/handlers/courseCollaboratorAdded',
    'synchronization/handlers/courseCollaborationStarted'],
    function (system, userDowngraded, userUpgradedToStarter, courseCollaboratorAdded, courseCollaborationStarted) {
        "use strict";

        return {
            start: function () {
                var dfd = Q.defer();

                var user = $.connection.user;
                var course = $.connection.course;

                user.client = {
                    userDowngraded: userDowngraded,
                    userUpgradedToStarter: userUpgradedToStarter
                };

                course.client = {
                    courseCollaboratorAdded: courseCollaboratorAdded,
                    courseCollaborationStarted: courseCollaborationStarted
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