define([],
    function () {

        return {
            accessType: {
                free: '0',
                starter: '1',
                plus: '2'
            },

            questionType: {
                multipleSelect: {
                    type: 0,
                    name: 'multipleSelect',
                    image: '/Content/images/multiselect-question.png'
                },
                fillInTheBlank: {
                    type: 1,
                    name: 'fillInTheBlank',
                    image: '/Content/images/fillintheblank-question.png'
                },
                dragAndDropText: {
                    type: 2,
                    name: 'dragAndDropText',
                    image: '/Content/images/draganddroptext-question.png'
                },
                multipleChoice: {
                    type: 3,
                    name: 'multipleChoice',
                    image: '/Content/images/multichoice-question.png'
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
                questionTitle: 5000
            },

            validation: {
                objectiveTitleMaxLength: 255,
                courseTitleMaxLength: 255,
                questionTitleMaxLength: 255
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
                    action: {
                        started: 'course:action-started'
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
                    deletedByCollaborator: 'question:deletedByCollaborator',

                    answer: {
                        addedByCollaborator: 'question:answer:addedByCollaborator',
                        deletedByCollaborator: 'question:answer:deletedByCollaborator',
                        textUpdatedByCollaborator: 'question:answer:textUpdatedByCollaborator',
                        multipleselectAnswerCorrectnessUpdatedByCollaborator: 'question:answer:multipleselectAnswerCorrectnessUpdatedByCollaborator',
                        multiplechoiceAnswerCorrectnessUpdatedByCollaborator: 'question:answer:multiplechoiceAnswerCorrectnessUpdatedByCollaborator',
                        multiplechoiceDeleteByCollaborator: 'question:answer:multiplechoiceDeletedByCollaborator'
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
                    }

                },
                helpHint: {
                    shown: 'helphint:shown',
                    hidden: 'helphint:hidden'
                },
                treeOfContent: {
                    expanded: 'treeOfContent:expanded',
                    collapsed: 'treeOfContent:collapsed'
                }
            },

            defaultObjectiveImage: '/Content/images/objective.png',

            patterns: {
                email: /^([\w\.\-]+)@([\w\-]+)((\.(\w){2,6})+)$/
            },

            maxStarterPlanCollaborators: 3
        };
    }
);