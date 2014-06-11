define(['durandal/system', 'synchronization/handlers/userEventHandler', 'synchronization/handlers/courseEventHandler', 'synchronization/handlers/objectiveEventHandler'],
    function (system, userEventHandler, courseEventHandler, objectiveEventHandler) {
        "use strict";

        return {
            start: function () {
                var dfd = Q.defer();

                var hub = $.connection.eventHub;

                hub.client = {
                    userDowngraded: userEventHandler.userDowngraded,
                    userUpgradedToStarter: userEventHandler.userUpgradedToStarter,

                    courseCollaboratorAdded: courseEventHandler.collaboratorAdded,
                    courseCollaborationStarted: courseEventHandler.collaborationStarted,
                    courseTitleUpdated: courseEventHandler.titleUpdated,
                    courseIntroducationContentUpdated: courseEventHandler.introducationContentUpdated,
                    courseTemplateUpdated: courseEventHandler.templateUpdated,
                    courseObjectivesReordered: courseEventHandler.objectivesReordered,
                    coursePublished: courseEventHandler.published,
                    courseDeleted: courseEventHandler.deleted,

                    objectiveTitleUpdated: objectiveEventHandler.objectiveTitleUpdated,
                    objectiveQuestionsReordered: objectiveEventHandler.questionsReordered
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