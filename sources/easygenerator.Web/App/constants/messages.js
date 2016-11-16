export default {
    user: {
        identified: 'user:identified',
        downgraded: 'user:downgraded',
        upgradedToStarter: 'user:upgradedToStarter',
        upgradedToPlus: 'user:upgradedToPlus',
        upgradedToAcademy: 'user:upgradedToAcademy',
        upgradedToAcademyBT: 'user:upgradedToAcademyBT',
        planChanged: 'user:planChanged'
    },
    library: {
        defaultActivate: 'library:default:activate'
    },
    questionNavigation: {
        navigateToQuestion: 'navigation:navigateToQuestion',
        navigateToCourse: 'navigation:navigateToCurse'
    },
    organization: {
        created: 'organization:created',
        userRemoved: 'organization:userRemoved',
        usersAdded: 'organization:usersAdded',
        userRegistered: 'organization:userRegistsred',
        inviteCreated: 'organization:inviteCreated',
        inviteRemoved: 'organization:inviteRemoved',
        titleUpdated: 'organization:titleUpdated',
        userStatusUpdated: 'organization:userStatusUpdated',
        membershipStarted: 'organization:membershipStarted',
        membershipFinished: 'organization:membershipFinished',
        courseCollaborationStarted: 'organization:courseCollaborationStarted'
    },
    course: {
        created: 'course:created',
        deleted: 'course:deleted',
        deletedByCollaborator: 'course:deletedByCollaborator',
        titleUpdated: 'course:titleUpdated',
        titleUpdatedByCollaborator: 'course:titleUpdatedByCollaborator',
        introductionContentUpdated: 'course:introductionContentUpdated',
        introductionContentUpdatedByCollaborator: 'course:introductionContentUpdatedByCollaborator',
        sectionRelated: 'course:sectionRelated',
        sectionRelatedByCollaborator: 'course:sectionRelatedByCollaborator',
        sectionsUnrelated: 'course:sectionsUnrelated',
        sectionsUnrelatedByCollaborator: 'course:sectionsUnrelatedByCollaborator',
        sectionsReordered: 'course:sectionsReordered',
        sectionsReorderedByCollaborator: 'course:sectionsReorderedByCollaborator',
        templateUpdatedByCollaborator: 'course:templateUpdatedByCollaborator',
        templateUpdated: 'course:templateUpdated',
        stateChanged: 'course:stateChanged',
        ownershipUpdated: 'course:ownershipUpdated',
        modified: 'course:modified',
        peopleAdded: 'course:peopleAdded',
        accessGranted: 'course:accessGranted',
        accessRemoved: 'course:accessRemoved',
        invitationSended: 'course:invitationSended',
        build: {
            started: 'course:build-started',
            completed: 'course:build-completed',
            failed: 'course:build-failed'
        },
        scormBuild: {
            started: 'course:scormBuild-started',
            completed: 'course:scormBuild-completed',
            failed: 'course:scormBuild-failed'
        },
        publish: {
            started: 'course:publish-started',
            completed: 'course:publish-completed',
            failed: 'course:publish-failed'
        },
        publishToCoggno: {
            started: 'course:publish-coggno-started',
            completed: 'course:publish-coggno-completed',
            failed: 'course:publish-coggno-failed',
            processed: 'course:processing-coggno-completed'
        },
        publishForReview: {
            started: 'course:review-publish-started',
            completed: 'course:review-publish-completed',
            failed: 'course:review-publish-failed'
        },
        publishToCustomLms: {
            started: 'course:publishToCustomLms-started',
            completed: 'course:publishToCustomLms-comleted',
            failed: 'course:publishToCustomLms-failed'
        },
        delivering: {
            started: 'course:delivering-started',
            finished: 'course:delivering-finished'
        },
        collaboration: {
            inviteCreated: 'course:collaboration-invite-created:',
            inviteRemoved: 'course:collaboration-invite-removed:',
            inviteAccepted: 'course:collaboration-invite-accepted',
            inviteCourseTitleUpdated: 'course:collaboration-invite-course-title-updated',
            collaboratorAdded: 'course:collaboration-collaboratorAdded:',
            collaboratorRemoved: 'course:collaboration-collaboratorRemoved',
            collaboratorRegistered: 'course:collaboration-collaboratorRegistered:',
            collaboratorAccessTypeUpdated: 'course:collaboration-collaboratorAccessTypeUpdated',
            started: 'course:collaboration-started',
            disabled: 'course:collaboration-disabled',
            finished: 'course:collaboration-finished',
            finishedByCollaborator: 'course:collaboration-finishedByCollaborator',
            deleting: {
                started: 'collaborator:deleting-started:',
                completed: 'collaborator:deleting-completed:',
                failed: 'collaborator:deleting-failed:'
            }
        },
        comment: {
            deletedByCollaborator: 'course:comment:deletedByCollaborator',
            createdByCollaborator: 'course:comment:createdByCollaborator'
        }
    },
    learningPath: {
        courseSelector: {
            courseSelected: 'learningPath:course-selector:course-selected',
            courseDeselected: 'learningPath:course-selector:course-deselected'
        },
        removeCourse: 'learningPath:removeCourse',
        createCourse: 'learningPath:createCourse',
        removeDocument: 'learningPath:removeDocument',
        delivering: {
            started: 'learningPath:delivering-started',
            finished: 'learningPath:delivering-finished'
        },
        deleted: 'learningPath:deleted'
    },
    section: {
        createdInCourse: 'section:createdInCourse',
        deleted: 'section:deleted',
        titleUpdated: 'section:titleUpdated',
        titleUpdatedByCollaborator: 'section:titleUpdatedByCollaborator',
        learningObjectiveUpdated: 'section:learningObjectiveUpdated',
        learningObjectiveUpdatedByCollaborator: 'section:learningObjectiveUpdatedByCollaborator',
        imageUrlUpdated: 'section:imageUrlUpdated',
        imageUrlUpdatedByCollaborator: 'section:imageUrlUpdatedByCollaborator',
        questionsReordered: 'section:questionsReordered',
        questionsReorderedByCollaborator: 'section:questionsReorderedByCollaborator',
        navigated: 'section:navigatedTo',
        modified: 'section:modified'
    },
    question: {
        created: 'question:created',
        createdByCollaborator: 'question:createdByCollaborator',
        deleted: 'questions:deleted',
        titleUpdated: 'question:titleUpdated',
        isSurveyUpdated: 'question:isSurveyUpdated',
        voiceOverUpdatedByCollaborator: 'question:voiceOverUpdatedByCollaborator',
        titleUpdatedByCollaborator: 'question:titleUpdatedByCollaborator',
        contentUpdatedByCollaborator: 'question:contentUpdatedByCollaborator',
        backgroundChangedByCollaborator: 'question:backgroundChangedByCollaborator',
        correctFeedbackUpdatedByCollaborator: 'question:correctFeedbackUpdatedByCollaborator',
        incorrectFeedbackUpdatedByCollaborator: 'question:incorrectFeedbackUpdatedByCollaborator',
        deletedByCollaborator: 'question:deletedByCollaborator',
        learningContentsReorderedByCollaborator: 'question:learningContentsReorderedByCollaborator',
        navigated: 'question:navigatedTo',

        answer: {
            addedByCollaborator: 'question:answer:addedByCollaborator',
            deletedByCollaborator: 'question:answer:deletedByCollaborator',
            textUpdatedByCollaborator: 'question:answer:textUpdatedByCollaborator',
            answerCorrectnessUpdatedByCollaborator: 'question:answer:answerCorrectnessUpdatedByCollaborator',
            singleSelectTextDeleteByCollaborator: 'question:answer:singleSelectTextDeletedByCollaborator'
        },

        learningContent: {
            createdByCollaborator: 'learningContent:createdByCollaborator',
            deletedByCollaborator: 'learningContent:deletedByCollaborator',
            updatedByCollaborator: 'learningContent:updatedByCollaborator'
        },

        fillInTheBlank: {
            updatedByCollaborator: 'question:fillInTheBlank:updatedByCollaborator'
        },

        dragAndDropText: {
            dropspotCreatedByCollaborator: 'question:dragAndDrop:dropspotCreatedByCollaborator',
            dropspotPositionChangedByCollaborator: 'question:dragAndDrop:dropspotPositionChangedByCollaborator',
            dropspotTextChangedByCollaborator: 'question:dragAndDrop:dropspotTextChangedByCollaborator',
            dropspotDeletedByCollaborator: 'question:dragAndDrop:dropspotDeletedByCollaborator'
        },

        hotSpot: {
            polygonCreatedByCollaborator: 'question:hotSpot:polygonCreatedByCollaborator',
            polygonUpdatedByCollaborator: 'question:hotSpot:polygonUpdatedByCollaborator',
            polygonDeletedByCollaborator: 'question:hotSpot:polygonDeletedByCollaborator',
            isMultipleUpdatedByCollaborator: 'question:hotSpot:isMultipleUpdatedByCollaborator'
        },

        textMatching: {
            answerCreatedByCollaborator: 'question:textMatching:answerCreatedByCollaborator',
            answerDeletedByCollaborator: 'question:textMatching:answerDeletedByCollaborator',
            answerKeyChangedByCollaborator: 'question:textMatching:answerKeyChangedByCollaborator',
            answerValueChangedByCollaborator: 'question:textMatching:answerValueChangedByCollaborator'
        },

        rankingText: {
            answerCreatedByCollaborator: 'question:rankingText:answerCreatedByCollaborator',
            answerDeletedByCollaborator: 'question:rankingText:answerDeletedByCollaborator',
            answerTextChangedByCollaborator: 'question:rankingText:answerTextChangedByCollaborator',
            answersReorderedByCollaborator: 'question:rankingText:answersReorderedByCollaborator'
        },

        singleSelectImage: {
            answerCreatedByCollaborator: 'question:singleSelectImage:answerCreatedByCollaborator',
            answerDeletedByCollaborator: 'question:singleSelectImage:answerDeletedByCollaborator',
            answerImageUpdatedByCollaborator: 'question:singleSelectImage:answerImageUpdatedByCollaborator',
            correctAnswerChangedByCollaborator: 'question:singleSelectImage:correctAnswerChangedByCollaborator'
        },

        scenario: {
            dataUpdated: 'question:scenario:dataUpdated',
            masteryScoreUpdated: 'question:scenario:masteryScoreUpdated'
        }
    },
    treeOfContent: {
        expanded: 'treeOfContent:expanded',
        collapsed: 'treeOfContent:collapsed'
    },
    onboarding: {
        closed: 'onboarding:closed'
    },
    sidePanel: {
        expanded: 'sidePanel:expanded',
        collapsed: 'sidePanel:collapsed'
    },
    notification: {},
    branchtrack: {
        projectSelected: 'branchtrack:projectSelected',
        dialogClosed: 'branchtrack:dialogClosed'
    },
    content: {
        create: 'content:create',
        startEditing: 'content:startEditing',
        endEditing: 'content:endEditing'
    },
    includeMedia: {
        modeChanged: 'includeMedia:modeChanged'
    },
    themes: {
        added: 'themes:added',
        updated: 'themes:updated',
        deleted: 'themes:deleted'
    }
};