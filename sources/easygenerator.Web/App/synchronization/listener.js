define([
        'durandal/system',
        'synchronization/handlers/user/handler',
        'synchronization/handlers/course/handler',
        'synchronization/handlers/section/handler',
        'synchronization/handlers/questions/handler',
        'synchronization/handlers/answer/handler',
        'synchronization/handlers/comment/handler',
        'synchronization/handlers/learningContent/handler',
        'synchronization/handlers/collaboration/handler',
        'synchronization/handlers/organizations/handler'],
    function (system,
        userEventHandler,
        courseEventHandler,
        sectionEventHandler,
        questionEventHandler,
        answerEventHandler,
        commentEventHandler,
        learningContentEventHandler,
        collaborationEventHandler,
        organizationEventHandler) {
        "use strict";

        return {
            start: function () {
                return window.auth.getToken('signalr').then(function(token) {
                    var dfd = Q.defer();

                    var hub = $.connection.eventHub;

                    // Send access token as query string parameter because of WebSockets doesn't support Authorization header
                    // Need to be changed as soon as another solutions will be found
                    $.connection.hub.qs = { 'access_token': token };

                    hub.client = {
                        userDowngraded: userEventHandler.downgraded,
                        userUpgradedToStarter: userEventHandler.upgradedToStarter,
                        userUpgradedToPlus: userEventHandler.upgradedToPlus,
                        userUpgradedToAcademy: userEventHandler.upgradedToAcademy,
                        userUpgradedToAcademyBT: userEventHandler.upgradedToAcademyBT,

                        courseCollaboratorAdded: collaborationEventHandler.collaboratorAdded,
                        courseCollaborationStarted: collaborationEventHandler.started,
                        collaboratorRegistered: collaborationEventHandler.collaboratorRegistered,
                        courseCollaborationFinished: collaborationEventHandler.finished,
                        collaboratorRemoved: collaborationEventHandler.collaboratorRemoved,
                        collaborationInviteRemoved: collaborationEventHandler.inviteRemoved,
                        collaborationInviteCreated: collaborationEventHandler.inviteCreated,
                        collaborationInviteAccepted: collaborationEventHandler.inviteAccepted,
                        collaborationInviteCourseTitleUpdated: collaborationEventHandler.inviteCourseTitleUpdated,
                        collaboratorAccessTypeUpdated: collaborationEventHandler.collaboratorAccessTypeUpdated,

                        courseStateChanged: courseEventHandler.stateChanged,
                        courseTitleUpdated: courseEventHandler.titleUpdated,
                        courseIntroductionContentUpdated: courseEventHandler.introductionContentUpdated,
                        courseTemplateUpdated: courseEventHandler.templateUpdated,
                        courseSectionsReordered: courseEventHandler.sectionsReordered,
                        coursePublished: courseEventHandler.published,
                        coursePublishedForSale: courseEventHandler.publishedForSale,
                        courseProcessedByCoggno: courseEventHandler.processedByCoggno,
                        courseDeleted: courseEventHandler.deleted,
                        courseSectionRelated: courseEventHandler.sectionRelated,
                        courseSectionsUnrelated: courseEventHandler.sectionsUnrelated,
                        courseSectionsReplaced: courseEventHandler.sectionsReplaced,
                        courseOwnershipUpdated: courseEventHandler.ownershipUpdated,

                        sectionTitleUpdated: sectionEventHandler.titleUpdated,
                        sectionImageUrlUpdated: sectionEventHandler.imageUrlUpdated,
                        sectionQuestionsReordered: sectionEventHandler.questionsReordered,

                        questionCreated: questionEventHandler.question.created,
                        questionsDeleted: questionEventHandler.question.deleted,
                        questionTitleUpdated: questionEventHandler.question.titleUpdated,
                        questionVoiceOverUpdated: questionEventHandler.question.voiceOverUpdated,
                        questionContentUpdated: questionEventHandler.question.contentUpdated,
                        questionCorrectFeedbackUpdated: questionEventHandler.question.correctFeedbackUpdated,
                        questionIncorrectFeedbackUpdated: questionEventHandler.question.incorrectFeedbackUpdated,
                        questionBackgroundChanged: questionEventHandler.question.backgroundChanged,
                        learningContentsReordered: questionEventHandler.question.learningContentsReordered,

                        fillInTheBlankUpdated: questionEventHandler.fillInTheBlank.updated,

                        dragAndDropDropspotCreated: questionEventHandler.dragAndDropText.dropspotCreated,
                        dragAndDropDropspotDeleted: questionEventHandler.dragAndDropText.dropspotDeleted,
                        dragAndDropDropspotTextChanged: questionEventHandler.dragAndDropText.dropspotTextChanged,
                        dragAndDropDropspotPositionChanged: questionEventHandler.dragAndDropText.dropspotPositionChanged,

                        textMatchingAnswerCreated: questionEventHandler.textMatching.answerCreated,
                        textMatchingAnswerDeleted: questionEventHandler.textMatching.answerDeleted,
                        textMatchingAnswerKeyChanged: questionEventHandler.textMatching.answerKeyChanged,
                        textMatchingAnswerValueChanged: questionEventHandler.textMatching.answerValueChanged,

                        rankingTextAnswerCreated: questionEventHandler.rankingText.answerCreated,
                        rankingTextAnswerDeleted: questionEventHandler.rankingText.answerDeleted,
                        rankingTextAnswerTextChanged: questionEventHandler.rankingText.answerTextChanged,
                        rankingTextAnswersReordered: questionEventHandler.rankingText.answersReordered,

                        singleSelectImageAnswerCreated: questionEventHandler.singleSelectImage.answerCreated,
                        singleSelectImageAnswerDeleted: questionEventHandler.singleSelectImage.answerDeleted,
                        singleSelectImageAnswerImageUpdated: questionEventHandler.singleSelectImage.answerImageUpdated,
                        singleSelectImageCorrectAnswerChanged: questionEventHandler.singleSelectImage.correctAnswerChanged,

                        answerCreated: answerEventHandler.created,
                        answerDeleted: answerEventHandler.deleted,
                        answerTextUpdated: answerEventHandler.textUpdated,
                        answerCorrectnessUpdated: answerEventHandler.answerCorrectnessUpdated,

                        learningContentCreated: learningContentEventHandler.created,
                        learningContentUpdated: learningContentEventHandler.textUpdated,
                        learningContentDeleted: learningContentEventHandler.deleted,

                        hotSpotPolygonCreated: questionEventHandler.hotSpot.polygonCreated,
                        hotSpotPolygonDeleted: questionEventHandler.hotSpot.polygonDeleted,
                        hotSpotPolygonChanged: questionEventHandler.hotSpot.polygonChanged,
                        hotSpotIsMultipleChanged: questionEventHandler.hotSpot.isMultipleChanged,

                        scenarioDataUpdated: questionEventHandler.scenario.dataUpdated,
                        scenarioMasteryScoreUpdated: questionEventHandler.scenario.masteryScoreUpdated,

                    	commentDeleted: commentEventHandler.deleted,
                    	commentCreated: commentEventHandler.created,

                        organizationUserRegistered: organizationEventHandler.userRegistered,
                        organizationInviteAccepted: organizationEventHandler.inviteAccepted,
                        organizationInviteDeclined: organizationEventHandler.inviteDeclined,
                        organizationInviteCreated: organizationEventHandler.inviteCreated,
                        organizationInviteRemoved: organizationEventHandler.inviteRemoved,
                        organizationTitleUpdated: organizationEventHandler.titleUpdated,
                        organizationMembershipStarted: organizationEventHandler.membershipStarted,
                        organizationMembershipFinished: organizationEventHandler.membershipFinished,
                        organizationUserAdded: organizationEventHandler.userAdded
                    };

                    $.connection.hub.disconnected(function () {
                        $.ajax({
                            type: 'get',
                            url: '/ping.ashx'
                        }).error(function (error) {
                            if (error.status == 503) {
                                window.location.reload(true);
                            }
                        });
                    });

                    $.connection.hub.start()
                        .done(function () {
                            system.log("Synchronization with server was established");
                            dfd.resolve();
                        }).fail(function () {
                            dfd.reject('Could not establish synchronization with server');
                        });

                    return dfd.promise;
                });
            }
        };
    }
);
