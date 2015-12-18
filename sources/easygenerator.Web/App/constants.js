export default {
appVersion: window.egVersion,

    accessType: {
    free: 0,
    starter: 1,
    plus: 2,
    academy: 3,
    trial: 100
    },

questionType: {
        multipleSelect: {
            type: 'multipleSelect',
            image: '/Content/images/multiselect-question.png'
        },
    fillInTheBlank: {
            type: 'fillInTheBlank',
            image: '/Content/images/fillintheblank-question.png'
    },
    dragAndDropText: {
            type: 'dragAndDropText',
            image: '/Content/images/draganddroptext-question.png'
    },
    singleSelectText: {
            type: 'singleSelectText',
            image: '/Content/images/singleselecttext-question.png'
    },
    informationContent: {
            type: 'informationContent',
            image: '/Content/images/info-question.png'
    },
    singleSelectImage: {
            type: 'singleSelectImage',
            image: '/Content/images/singleselectimage-question.png'
    },
    textMatching: {
            type: 'textMatching',
            image: '/Content/images/textmatching-question.png'
    },
    hotspot: {
            type: 'hotspot',
            image: '/Content/images/hotspot-question.png'
    },
    statement: {
            type: 'statement',
            image: '/Content/images/statement-question.png'
    },
    openQuestion: {
            type: 'openQuestion',
            image: '/Content/images/open-question.png'
    },
    scenario: {
            type: 'scenario',
            image: '/Content/images/scenario-question.png'
    }
},

questionFeedback: {
        correct: 'correct',
        incorrect: 'incorrect'
},

learningContentsTypes: {
        content: 'content',
        hotspot: 'hotspot'
},

sortingOptions: {
        byTitleAsc: 'byTitleAsc',
        byTitleDesc: 'byTitleDesc'
},

publishingStates: {
        building: 'building',
        publishing: 'publishing',
        succeed: 'succeed',
        failed: 'failed'
},

collaboratorStates: {
        deleting: 'deleting'
},
autosaveTimersInterval: {
        answerOption: 60000,
        learningContent: 60000,
        entityContent: 60000,
        questionTitle: 5000,
        feedbackText: 60000
},

validation: {
        objectiveTitleMaxLength: 255,
        courseTitleMaxLength: 255,
        questionTitleMaxLength: 255,
        textMatchingKeyMaxLength: 255,
        textMatchingValueMaxLength: 255,
        learningPathTitleMaxLength: 255
},

messages: {
        user: {
            identified: 'user:identified',
            downgraded: 'user:downgraded',
            upgradedToStarter: 'user:upgradedToStarter',
            upgradedToPlus: 'user:upgradedToPlus',
            upgradedToAcademy: 'user:upgradedToAcademy'
        },
    course: {
            created: 'course:created',
            deleted: 'course:deleted',
            deletedByCollaborator: 'course:deletedByCollaborator',
            titleUpdated: 'course:titleUpdated',
            titleUpdatedByCollaborator: 'course:titleUpdatedByCollaborator',
            introductionContentUpdated: 'course:introductionContentUpdated',
            introductionContentUpdatedByCollaborator: 'course:introductionContentUpdatedByCollaborator',
            objectiveRelated: 'course:objectiveRelated',
            objectiveRelatedByCollaborator: 'course:objectiveRelatedByCollaborator',
            objectivesUnrelated: 'course:objectivesUnrelated',
            objectivesUnrelatedByCollaborator: 'course:objectivesUnrelatedByCollaborator',
            objectivesReordered: 'course:objectivesReordered',
            objectivesReorderedByCollaborator: 'course:objectivesReorderedByCollaborator',
            templateUpdatedByCollaborator: 'course:templateUpdatedByCollaborator',
            templateUpdated: 'course:templateUpdated',
            stateChanged: 'course:stateChanged',

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
                started: 'course:collaboration-started',
                disabled: 'course:collaboration-disabled',
                finished: 'course:collaboration-finished',
                deleting: {
                started: 'collaborator:deleting-started:',
                completed: 'collaborator:deleting-completed:',
                failed: 'collaborator:deleting-failed:'
                }
        }
    },
    learningPath: {
            courseSelector: {
                courseSelected: 'learningPath:course-selector:course-selected',
                courseDeselected: 'learningPath:course-selector:course-deselected'
            },
        removeCourse: 'learningPath:removeCourse',
        createCourse: 'learningPath:createCourse',
        delivering: {
            started: 'learningPath:delivering-started',
            finished: 'learningPath:delivering-finished'
        },
        deleted: 'learningPath:deleted'
    },
    objective: {
            createdInCourse: 'objective:createdInCourse',
            titleUpdated: 'objective:titleUpdated',
            titleUpdatedByCollaborator: 'objective:titleUpdatedByCollaborator',
            imageUrlUpdated: 'objective:imageUrlUpdated',
            imageUrlUpdatedByCollaborator: 'objective:imageUrlUpdatedByCollaborator',
            questionsReordered: 'objective:questionsReordered',
            questionsReorderedByCollaborator: 'objective:questionsReorderedByCollaborator'
    },
    question: {
            created: 'question:created',
            createdByCollaborator: 'question:createdByCollaborator',
            deleted: 'questions:deleted',
            titleUpdated: 'question:titleUpdated',
            voiceOverUpdatedByCollaborator: 'question:voiceOverUpdatedByCollaborator',
            titleUpdatedByCollaborator: 'question:titleUpdatedByCollaborator',
            contentUpdatedByCollaborator: 'question:contentUpdatedByCollaborator',
            backgroundChangedByCollaborator: 'question:backgroundChangedByCollaborator',
            correctFeedbackUpdatedByCollaborator: 'question:correctFeedbackUpdatedByCollaborator',
            incorrectFeedbackUpdatedByCollaborator: 'question:incorrectFeedbackUpdatedByCollaborator',
            deletedByCollaborator: 'question:deletedByCollaborator',
            learningContentsReorderedByCollaborator: 'question:learningContentsReorderedByCollaborator',

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
                textUpdatedByCollaborator: 'learningContent:textUpdatedByCollaborator',
                remove: 'learningContent:remove',
                updateText: 'learningContent:updateText',
                restore: 'learningContent:restore'
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
    helpHint: {
            shown: 'helphint:shown',
            hidden: 'helphint:hidden'
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
    notification: {

    },
    branchtrack: {
            projectSelected: 'branchtrack:projectSelected',
            dialogClosed: 'branchtrack:dialogClosed'
    }
},

patterns: {
        email: /^([\w\.\-]+)@([\w\-]+)((\.(\w){2,15})+)$/,
        coursePage: /courses\/[\d\w]+/
    },

notification: {
        keys: {
            subscriptionExpiration: 'notificationkeys:subscriptionExpiration',
            collaborationInvite: 'notificationkeys:collaborationInvite'
        },
    messages: {
            push: 'notification:push',
            remove: 'notification:remove'
    }
},

upgradeEvent: 'Upgrade now',

    upgradeUrl: '/account/upgrade',
signinUrl: '/signin',

upgradeCategory: {
    scorm: 'SCORM 1.2',
    changeLogo: 'Change logo',
    externalReview: 'External review',
    header: 'Header',
    userMenuInHeader: 'User menu in header',
    questions: 'Questions',
    expirationNotification: 'Expiration notification',
    courseLimitNotification: 'Course limit notification'
},

maxStarterPlanCollaborators: 3,

    eventCategories: {
    header: 'Header',
    informationContent: 'Information'
    },

clientContextKeys: {
        lastCreatedQuestionId: 'lastCreatedQuestionId',
        lastCreatedCourseId: 'lastCreatedCourseId',
        lastCreatedLearningPathId: 'lastCreatedLearningPathId',
        lastCreatedObjectiveId: 'lastCreatedObjectiveId',
        lastVistedCourse: 'lastVistedCourse',
        lastVisitedObjective: 'lastVisitedObjective',
        showCreateCoursePopup: 'showCreateCoursePopup'
},

reporting: {
        xApiVerbIds:
        {
            started: 'http://adlnet.gov/expapi/verbs/launched',
            passed: 'http://adlnet.gov/expapi/verbs/passed',
            failed: 'http://adlnet.gov/expapi/verbs/failed',
            answered: 'http://adlnet.gov/expapi/verbs/answered',
            mastered: 'http://adlnet.gov/expapi/verbs/mastered'
        },
    filterKeys: {
            courseId: 'context.extensions.http://easygenerator/expapi/course/id',
            learningPathId: 'context.extensions.http://easygenerator/expapi/learningpath/id',
            verb: 'verb',
            limit: 'limit',
            skip: 'skip',
            agent: 'agent',
            attemptId: 'registration',
            parentId: 'parent'
    }
},

frameSize: {
        width: {
            name: 'frameWidth',
            value: 930
        },
    height: {
            name: 'frameHeight',
            value: 700
    }
},

embedCode: '<iframe width="{W}" height="{H}" src="{src}" frameborder="0" allowfullscreen></iframe>',

    copyToClipboardWait: 5000,

results: {
    pageSize: 10
},

player: {
        host: window.playerUrl ? "//" + window.playerUrl : '//localhost:555'
},

storage: {
        host: window.storageServiceUrl ? "//" + window.storageServiceUrl : '//localhost:888',
        mediaUrl: '/media',
        userUrl: '/user',
        changesInQuota: 'storage:changesInQuota',
        video: {
        vimeoToken: 'bearer a6b8a8d804e9044f9aa091b6687e70c1',
        vimeoApiVideosUrl: 'https://api.vimeo.com/videos/',
        ticketUrl: '/api/media/video/upload',
        finishUrl: '/api/media/video/upload/finish',
        progressUrl: '/api/media/video/upload/progress',
        defaultThumbnailUrl: '//i.vimeocdn.com/video/default_200x150.jpg',
        cancelUrl: '/api/media/video/upload/cancel',
        deleteUrl: '/api/media/video/delete',
        statuses: {
                loaded: 'loaded',
                failed: 'failed',
                inProgress: 'inProgress'
        },
            vimeoVerifyStatus: 308,
            changesInUpload: 'video:changesInUpload',
            trackChangesInUploadTimeout: 500,
            iframeWidth: 600,
            iframeHeight: 335,
            updateUploadTimeout: 60000,
            removeVideoAfterErrorTimeout: 5000
        },
    audio: {
            convertionUrl: window.convertionServiceUrl ? "//" + window.convertionServiceUrl : '//staging.easygenerator.com/convertion',
            pullUrl: '/api/media/audio/pull',
            ticketUrl: '/api/media/audio/ticket',
            trackerTimeout: 25000,
            statuses: {
            available: 'available',
            notAvailable: 'notAvailable',
            notStarted: 'notStarted',
            loaded: 'loaded',
            failed: 'failed',
            inProgress: 'inProgress'
            },
        changesInUpload: 'video:changesInUpload',
        iframeWidth: 600,
        iframeHeight: 180,
        embedIframeWidth: 300,
        embedIframeHeight: 46
    }
},

dialogs: {
        stepSubmitted: 'dialog:step-submitted',
        dialogClosed: 'dialog:dialogClosed',
        deleteItem: {
        settings: {
                    containerCss: 'delete-item'
        }
        },
    deleteSection: {
            settings: {
                containerCss: 'delete-section'
            }
    },
    deleteCourse: {
            settings: {
                containerCss: 'delete-course'
            }
    },
    createCourse: {
            settings: {
                containerCss: 'create-course'
            }
    },
    changeCourseTemplate: {
            settings: {
                containerCss: 'change-course-template'
            }
    },
    releaseNote: {
            settings: {
                containerCss: 'release-note'
            }
    },
    moveCopyQuestion: {
            settings: {
                containerCss: 'move-copy-question'
            }
    },
    chooseVoiceOver: {
            settings: {
                containerCss: 'choose-voice-over'
            }
    },
    branchtrack: {
            settings: {
                containerCss: 'branchtrack-dialog'
            }
    },
    editorFeedback:{
            settings: {
                containerCss: 'editor-feedback',
                boundless: true
            }
    },
    upgrade: {
            settings: {
                default: {
            titleKey: 'upgradeDialogBoldTitle',
            subtitleKey: '',
            descriptionKey: '',
            upgradeBtnTextKey: 'upgradeDialogUpgradeNow',
            skipBtnTextKey: 'upgradeDialogMaybeLater',
            containerCss: 'upgrade-dialog-empty',
            eventCategory: ''
    },

    downloadResults: {
            containerCss: 'upgrade-dialog-download-results',
            eventCategory: 'Download results CSV',
            subtitleKey: 'resultsUpgradeForDownloadCSVDialogTitle2',
            descriptionKey: 'resultsUpgradeForDownloadCSVDialogHtml'
    },

    loadMoreResults: {
            containerCss: 'upgrade-dialog-all-results',
            eventCategory: 'Load more results',
            subtitleKey: 'resultsUpgradeDialogTitle2',
            descriptionKey: 'resultsUpgradeDialogText'
    },

    extendedResults: {
            containerCss: 'upgrade-dialog-extended-results',
            eventCategory: 'Load extended results',
            subtitleKey: 'resultsUpgradeForExtendedResultsTitle2',
            descriptionKey: 'resultsUpgradeForExtendedResultsHtml'
    },

    videoUpload: {
            containerCss: 'upgrade-dialog-video-upload',
            eventCategory: 'Video library',
            subtitleKey: 'videoUpgradeToUpload',
            descriptionKey: 'videoUpgradeToUploadHtml'
    },

    duplicateCourse: {
            containerCss: 'upgrade-dialog-duplicate-course',
            eventCategory: 'Duplicate course',
            subtitleKey: 'coursesUpgradeToHaveMore',
            descriptionKey: 'coursesUpgradeToHaveMoreHtml'
    },

    audioUpload: {
            containerCss: 'upgrade-dialog-audio-upload',
            eventCategory: 'Audio library',
            subtitleKey: 'audioUploadUpgradeSubtitle',
            descriptionKey: 'audioUploadUpgradeText'
    }
}
}
},

newCourseEditor: {
        switchToNewEditorMessageClosed: ':switchToNewEditorMessageClosed',
        switchToOldEditorMessageClosed: ':switchToOldEditorMessageClosed'
}
};
