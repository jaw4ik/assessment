define(['durandal/system', 'synchronization/handlers/user/handler', 'synchronization/handlers/course/handler', 'synchronization/handlers/objective/handler',
    'synchronization/handlers/question/handler', 'synchronization/handlers/answer/handler', 'synchronization/handlers/learningContent/handler', 'synchronization/handlers/collaboration/handler'],
    function (system, userEventHandler, courseEventHandler, objectiveEventHandler, questionEventHandler, answerEventHandler, learningContentEventHandler, collaborationEventHandler) {
        "use strict";

        return {
            start: function () {
                var dfd = Q.defer();

                var hub = $.connection.eventHub;

                hub.client = {
                    userDowngraded: userEventHandler.downgraded,
                    userUpgradedToStarter: userEventHandler.upgradedToStarter,

                    courseCollaboratorAdded: collaborationEventHandler.collaboratorAdded,
                    courseCollaborationStarted: collaborationEventHandler.started,
                    collaboratorRegistered: collaborationEventHandler.collaboratorRegistered,
                    collaborationDisabled: collaborationEventHandler.disabled,

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

                    dragAndDropBackgroundChanged: questionEventHandler.dragAndDropBackgroundChanged,
                    dragAndDropDropspotCreated: questionEventHandler.dragAndDropDropspotCreated,
                    dragAndDropDropspotDeleted: questionEventHandler.dragAndDropDropspotDeleted,
                    dragAndDropDropspotTextChanged: questionEventHandler.dragAndDropDropspotTextChanged,
                    dragAndDropDropspotPositionChanged: questionEventHandler.dragAndDropDropspotPositionChanged,

                    answerCreated: answerEventHandler.created,
                    answerDeleted: answerEventHandler.deleted,
                    answerTextUpdated: answerEventHandler.textUpdated,
                    multipleSelectAnswerCorrectnessUpdated: answerEventHandler.multipleSelectAnswerCorrectnessUpdated,
                    multiplechoiceAnswerCorrectnessUpdated: answerEventHandler.multiplechoiceAnswerCorrectnessUpdated,

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