﻿define([],
    function () {

        return {
            accessType: {
                free: '0',
                starter: '1',
                plus: '2'
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
                }
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

            registerOnAim4YouStates: {
                inProgress: 'registerInProgress',
                success: 'registerSuccess',
                fail: 'registerFail'
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
                textMatchingValueMaxLength: 255
            },

            messages: {
                user: {
                    identified: 'user:identified',
                    downgraded: 'user:downgraded',
                    upgradedToStarter: 'user:upgradedToStarter',
                    upgradedToPlus: 'user:upgradedToPlus'
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
                    templateUpdated: 'course:templateUpdated',

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
                    publishToAim4You: {
                        started: 'course:publishToAim4You-started',
                        completed: 'course:publishToAim4You-comleted',
                        failed: 'course:publishToAim4You-failed'
                    },
                    delivering: {
                        started: 'course:delivering-started',
                        finished: 'course:delivering-finished'
                    },
                    collaboration: {
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
                objective: {
                    createdInCourse: 'objective:createdInCourse',
                    titleUpdated: 'objective:titleUpdated',
                    titleUpdatedByCollaborator: 'objective:titleUpdatedByCollaborator',
                    questionsReordered: 'objective:questionsReordered',
                    questionsReorderedByCollaborator: 'objective:questionsReorderedByCollaborator'
                },
                question: {
                    created: 'question:created',
                    createdByCollaborator: 'question:createdByCollaborator',
                    deleted: 'questions:deleted',
                    titleUpdated: 'question:titleUpdated',
                    titleUpdatedByCollaborator: 'question:titleUpdatedByCollaborator',
                    contentUpdatedByCollaborator: 'question:contentUpdatedByCollaborator',
                    correctFeedbackUpdatedByCollaborator: 'question:correctFeedbackUpdatedByCollaborator',
                    incorrectFeedbackUpdatedByCollaborator: 'question:incorrectFeedbackUpdatedByCollaborator',
                    deletedByCollaborator: 'question:deletedByCollaborator',

                    answer: {
                        addedByCollaborator: 'question:answer:addedByCollaborator',
                        deletedByCollaborator: 'question:answer:deletedByCollaborator',
                        textUpdatedByCollaborator: 'question:answer:textUpdatedByCollaborator',
                        multipleselectAnswerCorrectnessUpdatedByCollaborator: 'question:answer:multipleselectAnswerCorrectnessUpdatedByCollaborator',
                        singleSelectTextAnswerCorrectnessUpdatedByCollaborator: 'question:answer:singleSelectTextAnswerCorrectnessUpdatedByCollaborator',
                        singleSelectTextDeleteByCollaborator: 'question:answer:singleSelectTextDeletedByCollaborator'
                    },

                    learningContent: {
                        createdByCollaborator: 'learningContent:createdByCollaborator',
                        deletedByCollaborator: 'learningContent:deletedByCollaborator',
                        textUpdatedByCollaborator: 'learningContent:textUpdatedByCollaborator',
                    },

                    fillInTheBlank: {
                        updatedByCollaborator: 'question:fillInTheBlank:updatedByCollaborator'
                    },

                    dragAndDrop: {
                        backgroundChangedByCollaborator: 'question:dragAndDrop:backgroundChangedByCollaborator',
                        dropspotCreatedByCollaborator: 'question:dragAndDrop:dropspotCreatedByCollaborator',
                        dropspotPositionChangedByCollaborator: 'question:dragAndDrop:dropspotPositionChangedByCollaborator',
                        dropspotTextChangedByCollaborator: 'question:dragAndDrop:dropspotTextChangedByCollaborator',
                        dropspotDeletedByCollaborator: 'question:dragAndDrop:dropspotDeletedByCollaborator'
                    },

                    textMatching: {
                        answerCreatedByCollaborator: 'question:textMatching:answerCreatedByCollaborator',
                        answerDeletedByCollaborator: 'question:textMatching:answerDeletedByCollaborator',
                        answerKeyChangedByCollaborator: 'question:textMatching:answerKeyChangedByCollaborator',
                        answerValueChangedByCollaborator: 'question:textMatching:answerValueChangedByCollaborator',
                    },

                    singleSelectImage: {
                        answerCreatedByCollaborator: 'question:singleSelectImage:answerCreatedByCollaborator',
                        answerDeletedByCollaborator: 'question:singleSelectImage:answerDeletedByCollaborator',
                        answerImageUpdatedByCollaborator: 'question:singleSelectImage:answerImageUpdatedByCollaborator',
                        correctAnswerChangedByCollaborator: 'question:singleSelectImage:correctAnswerChangedByCollaborator'
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
                }
            },

            defaultObjectiveImage: '/Content/images/objective.png',

            patterns: {
                email: /^([\w\.\-]+)@([\w\-]+)((\.(\w){2,6})+)$/
            },

            upgradeEvent: 'Upgrade now',

            upgradeUrl: '/account/upgrade',

            upgradeCategory: {
                scorm: 'SCORM 1.2',
                changeLogo: 'Change logo',
                externalReview: 'External review',
                header: 'Header',
                userMenuInHeader: 'User menu in header',
                questions: 'Questions',
                collaboration: 'Collaboration',
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
                lastVistedCourse: 'lastVistedCourse',
                lastVisitedObjective: 'lastVisitedObjective'
            }
        };
    }
);