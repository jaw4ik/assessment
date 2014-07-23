﻿define([
        'durandal/system', 'synchronization/handlers/user/handler', 'synchronization/handlers/course/handler', 'synchronization/handlers/objective/handler',
        'synchronization/handlers/questions/handler', 'synchronization/handlers/answer/handler', 'synchronization/handlers/learningContent/handler', 'synchronization/handlers/collaboration/handler'
],
    function(system, userEventHandler, courseEventHandler, objectiveEventHandler, questionEventHandler, answerEventHandler, learningContentEventHandler, collaborationEventHandler) {
        "use strict";

        return {
            start: function() {
                var dfd = Q.defer();

                var hub = $.connection.eventHub;

                hub.client = {
                    userDowngraded: userEventHandler.downgraded,
                    userUpgradedToStarter: userEventHandler.upgradedToStarter,
                    userUpgradedToPlus: userEventHandler.upgradedToPlus,

                    courseCollaboratorAdded: collaborationEventHandler.collaboratorAdded,
                    courseCollaborationStarted: collaborationEventHandler.started,
                    collaboratorRegistered: collaborationEventHandler.collaboratorRegistered,
                    courseCollaborationFinished: collaborationEventHandler.finished,
                    collaboratorRemoved: collaborationEventHandler.collaboratorRemoved,

                    courseTitleUpdated: courseEventHandler.titleUpdated,
                    courseIntroductionContentUpdated: courseEventHandler.introductionContentUpdated,
                    courseTemplateUpdated: courseEventHandler.templateUpdated,
                    courseObjectivesReordered: courseEventHandler.objectivesReordered,
                    coursePublished: courseEventHandler.published,
                    courseDeleted: courseEventHandler.deleted,
                    courseObjectiveRelated: courseEventHandler.objectiveRelated,
                    courseObjectivesUnrelated: courseEventHandler.objectivesUnrelated,
                    courseObjectivesReplaced: courseEventHandler.objectivesReplaced,

                    objectiveTitleUpdated: objectiveEventHandler.titleUpdated,
                    objectiveQuestionsReordered: objectiveEventHandler.questionsReordered,

                    questionCreated: questionEventHandler.question.created,
                    questionsDeleted: questionEventHandler.question.deleted,
                    questionTitleUpdated: questionEventHandler.question.titleUpdated,
                    questionContentUpdated: questionEventHandler.question.contentUpdated,
                    questionCorrectFeedbackUpdated: questionEventHandler.question.correctFeedbackUpdated,
                    questionIncorrectFeedbackUpdated: questionEventHandler.question.incorrectFeedbackUpdated,

                    fillInTheBlankUpdated: questionEventHandler.fillInTheBlank.updated,

                    dragAndDropBackgroundChanged: questionEventHandler.dragAndDrop.backgroundChanged,
                    dragAndDropDropspotCreated: questionEventHandler.dragAndDrop.dropspotCreated,
                    dragAndDropDropspotDeleted: questionEventHandler.dragAndDrop.dropspotDeleted,
                    dragAndDropDropspotTextChanged: questionEventHandler.dragAndDrop.dropspotTextChanged,
                    dragAndDropDropspotPositionChanged: questionEventHandler.dragAndDrop.dropspotPositionChanged,

                    textMatchingAnswerCreated: questionEventHandler.textMatching.answerCreated,
                    textMatchingAnswerDeleted: questionEventHandler.textMatching.answerDeleted,
                    textMatchingAnswerKeyChanged: questionEventHandler.textMatching.answerKeyChanged,
                    textMatchingAnswerValueChanged: questionEventHandler.textMatching.answerValueChanged,

                    answerCreated: answerEventHandler.created,
                    answerDeleted: answerEventHandler.deleted,
                    answerTextUpdated: answerEventHandler.textUpdated,
                    multipleSelectAnswerCorrectnessUpdated: answerEventHandler.multipleSelectAnswerCorrectnessUpdated,
                    singleSelectTextAnswerCorrectnessUpdated: answerEventHandler.singleSelectTextAnswerCorrectnessUpdated,

                    learningContentCreated: learningContentEventHandler.created,
                    learningContentUpdated: learningContentEventHandler.textUpdated,
                    learningContentDeleted: learningContentEventHandler.deleted
                };

                $.connection.hub.start()
                    .done(function() {
                        system.log("Synchronization with server was established");
                        dfd.resolve();
                    }).fail(function() {
                        dfd.reject('Could not establish synchronization with server');
                    });

                return dfd.promise;
            }
        };
    }
);