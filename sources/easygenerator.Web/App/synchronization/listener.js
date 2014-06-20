define(['durandal/system', 'synchronization/handlers/user/handler', 'synchronization/handlers/course/handler', 'synchronization/handlers/objective/handler',
    'synchronization/handlers/question/handler', 'synchronization/handlers/answer/handler', 'synchronization/handlers/learningContent/handler'],
    function (system, userEventHandler, courseEventHandler, objectiveEventHandler, questionEventHandler, answerEventHandler, learningContentEventHandler) {
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
                    collaboratorRegistered: courseEventHandler.collaboratorRegistered,
                    courseTitleUpdated: courseEventHandler.titleUpdated,
                    courseIntroductionContentUpdated: courseEventHandler.introductionContentUpdated,
                    courseTemplateUpdated: courseEventHandler.templateUpdated,
                    courseObjectivesReordered: courseEventHandler.objectivesReordered,
                    coursePublished: courseEventHandler.published,
                    courseDeleted: courseEventHandler.deleted,
                    courseObjectiveRelated: courseEventHandler.objectiveRelated,
                    courseObjectivesUnrelated: courseEventHandler.objectivesUnrelated,

                    objectiveTitleUpdated: objectiveEventHandler.titleUpdated,
                    objectiveQuestionsReordered: objectiveEventHandler.questionsReordered,

                    questionCreated: questionEventHandler.created,
                    questionsDeleted: questionEventHandler.deleted,
                    questionTitleUpdated: questionEventHandler.titleUpdated,
                    questionContentUpdated: questionEventHandler.contentUpdated,

                    fillInTheBlankUpdated: questionEventHandler.fillInTheBlankUpdated,

                    answerCreated: answerEventHandler.created,
                    answerDeleted: answerEventHandler.deleted,
                    answerTextUpdated: answerEventHandler.textUpdated,
                    answerCorrectnessUpdated: answerEventHandler.correctnessUpdated,

                    learningContentCreated: learningContentEventHandler.created,
                    learningContentUpdated: learningContentEventHandler.textUpdated,
                    learningContentDeleted: learningContentEventHandler.deleted
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