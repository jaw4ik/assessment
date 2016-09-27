import { iterable } from 'models/helpers';

export default {
appVersion: window.egVersion,

    accessType: {
    free: 0,
    starter: 1,
    plus: 2,
    academy: 3,
    academyBT: 4,
    trial: 100
    },

organizationUserStatus: {
        waitingForAcceptance: 0,
        accepted: 1,
        declined: 2,
        waitingForEmailConfirmation: 3
},

courseOwnership: {
        owned: 0,
        shared: 1,
        organization: 2
},

documentType: Object.assign({
    video: 0,
    powerPoint: 1,
    pdf: 2,
    office: 3
}, iterable),

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
        },
        rankingText: {
                type: 'rankingText',
                image: '/Content/images/rankingtext-question.png'
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
        sectionTitleMaxLength: 255,
        courseTitleMaxLength: 255,
        organizationTitleMaxLength: 255,
        questionTitleMaxLength: 255,
        textMatchingKeyMaxLength: 255,
        textMatchingValueMaxLength: 255,
        learningPathTitleMaxLength: 255,
        documentTitleMaxLength: 255
},

messages: {
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
            created:'organization:created'  ,
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
    notification: {

    },
    branchtrack: {
            projectSelected: 'branchtrack:projectSelected',
            dialogClosed: 'branchtrack:dialogClosed'
    },
    includeMedia: {
            modeChanged: 'includeMedia:modeChanged'
    },
    themes: {
            added: 'themes:added',
            updated: 'themes:updated',
            deleted: 'themes:deleted'
    }
},

patterns: {
        email: /^[^@\s]+@[^@\s]+$/,
        coursePage: /courses\/[\d\w]+/
    },

notification: {
        keys: {
            subscriptionExpiration: 'notificationkeys:subscriptionExpiration',
            collaborationInvite: 'notificationkeys:collaborationInvite',
            organizationInvite: 'notificationkeys:organizationInvite'
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
        lastCreatedSectionId: 'lastCreatedSectionId',
        lastVistedCourse: 'lastVistedCourse',
        lastVisitedSection: 'lastVisitedSection',
        showCreateCoursePopup: 'showCreateCoursePopup',
        highlightedSectionId: 'highlightedSectionId',
        questionDataToNavigate: 'questionDataToNavigate'
},

reporting: {
        xApiVerbIds:
        {
            started: 'http://adlnet.gov/expapi/verbs/launched',
            progressed: 'http://adlnet.gov/expapi/verbs/progressed',
            passed: 'http://adlnet.gov/expapi/verbs/passed',
            failed: 'http://adlnet.gov/expapi/verbs/failed',
            answered: 'http://adlnet.gov/expapi/verbs/answered',
            mastered: 'http://adlnet.gov/expapi/verbs/mastered',
            experienced: 'http://adlnet.gov/expapi/verbs/experienced'
        },
    xApiActivityTypes: {
            course: 'http://adlnet.gov/expapi/activities/course',
            objective: 'http://adlnet.gov/expapi/activities/objective'
    },
    filterKeys: {
            courseId: 'context.extensions.http://easygenerator/expapi/course/id',
            learningPathId: 'context.extensions.http://easygenerator/expapi/learningpath/id',
            verb: 'verb',
            type: 'type',
            limit: 'limit',
            skip: 'skip',
            agent: 'agent',
            attemptId: 'registration',
            parentId: 'parent',
            embeded: 'embeded'
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
    host: window.playerUrl ? "//" + window.playerUrl : '//localhost:555',
    sourcesPath: '/sources'
},

storage: {
        host: window.storageServiceUrl ? "//" + window.storageServiceUrl : '//localhost:888',
        mediaUrl: '/media',
        userUrl: '/user',
        changesInQuota: 'storage:changesInQuota',
        video: {
        vimeoUrl: 'https://vimeo.com',
        vimeoOembedUrl: '/api/oembed.json',
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
            deleteUrl: '/api/media/audio/delete',
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
    survey: {
            settings: {
                containerCss: 'survey'
            }
    },
    editorFeedback: {
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
    },

    manageOrganization: {
            containerCss: 'upgrade-dialog-manage-organization',
            eventCategory: 'Manage organization',
            subtitleKey: 'manageOrganizationUpgradeSubtitle',
            descriptionKey: 'manageOrganizationUpgradeText'
    },
    publishToCoggno: {
        containerCss: 'upgrade-dialog-publish-coggno',
        eventCategory: 'Publish to Coggno',
        subtitleKey: 'publishToCoggnoUpgradeSubtitle',
        descriptionKey: 'publishToCoggnoUpgradeText'
    },
    saveThemes: {
            containerCss: 'upgrade-dialog-save-themes',
            eventCategory: 'Save themes',
            subtitleKey: 'saveThemesUpgradeSubtitle',
            descriptionKey: 'saveThemesUpgradeText'
    }
    }
}
},

newCourseEditor: {
        switchToNewEditorMessageClosed: ':switchToNewEditorMessageClosed',
        switchToOldEditorMessageClosed: ':switchToOldEditorMessageClosed'
},

winToWeb: {
        host: window.winToWebConvertionServiceUrl ? "//" + window.winToWebConvertionServiceUrl : '//localhost:444'
},

coggno: {
    serviceUrl: window.coggnoServiceUrl || 'https://coggno.com/',
    serviceProviderUrl: window.coggnoServiceProviderUrl || 'https://coggno.com/easygenerator/sp/saml_login'
},

surveyPopup: {
    originUrl: window.surveyPopupOriginUrl,
    pageUrl: window.surveyPopupPageUrl
},

comment: {
        context: {
            types: {
                    course: 'course',
                    section: 'section',
                    question: 'question',
                    informationContent: 'informationContent'
            },
            properties: {
                    title: 'title',
                    introduction: 'introduction',
                    voiceOver: 'voiceOver',
                    learningContent: 'learningContent'
            }
        }
}
};