define(['durandal/system', 'synchronization/handlers/userEventHandler', 'synchronization/handlers/courseEventHandler'],
    function (system, userEventHandler, courseEventHandler) {
        "use strict";

        return {
            start: function () {
                var dfd = Q.defer();

                var hub = $.connection.eventHub;

                hub.client = {
                    userDowngraded: userEventHandler.userDowngraded,
                    userUpgradedToStarter: userEventHandler.userUpgradedToStarter,

                    courseCollaboratorAdded: courseEventHandler.courseCollaboratorAdded,
                    courseCollaborationStarted: courseEventHandler.courseCollaborationStarted,
                    courseTitleUpdated: courseEventHandler.courseTitleUpdated,
                    courseIntroducationContentUpdated: courseEventHandler.courseIntroducationContentUpdated
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