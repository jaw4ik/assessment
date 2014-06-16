define(['durandal/system', 'synchronization/handlers/user/handler', 'synchronization/handlers/course/handler', 'synchronization/handlers/objectiveEventHandler',
    'synchronization/handlers/question/handler', 'synchronization/handlers/answer/handler'],
    function (system, userEventHandler, courseEventHandler, objectiveEventHandler, questionEventHandler, answerEventHandler) {
        "use strict";

        return {
            start: function () {
                var dfd = Q.defer();

                var hub = $.connection.eventHub;

                hub.client = {
                    userDowngraded: userEventHandler.downgraded,
                    userUpgradedToStarter: userEventHandler.upgradedToStarter,

                    courseCollaboratorAdded: courseEventHandler.collaboratorAdded,
                    courseCollaborationStarted: courseEventHandler.collaborationStarted,
                    courseTitleUpdated: courseEventHandler.titleUpdated,
                    courseIntroductionContentUpdated: courseEventHandler.introductionContentUpdated,
                    courseTemplateUpdated: courseEventHandler.templateUpdated,
                    courseObjectivesReordered: courseEventHandler.objectivesReordered,
                    coursePublished: courseEventHandler.published,
                    courseDeleted: courseEventHandler.deleted,
                    courseObjectiveRelated: courseEventHandler.objectiveRelated,
                    courseObjectivesUnrelated: courseEventHandler.objectivesUnrelated,

                    objectiveTitleUpdated: objectiveEventHandler.objectiveTitleUpdated,
                    objectiveQuestionsReordered: objectiveEventHandler.questionsReordered,
                    questionCreated: objectiveEventHandler.questionCreated,

                    questionTitleUpdated: questionEventHandler.titleUpdated,
                    questionContentUpdated: questionEventHandler.contentUpdated,

                    answerCreated: answerEventHandler.created,
                    answerDeleted: answerEventHandler.deleted,
                    answerTextUpdated: answerEventHandler.textUpdated,
                    answerCorrectnessUpdated: answerEventHandler.correctnessUpdated
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