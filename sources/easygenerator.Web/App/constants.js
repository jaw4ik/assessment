define([],
    function () {

        return {

            accessType: {
                free: '0',
                starter: '1'
            },

            questionType: {
                multipleChoice: {
                    type: 0,
                    image: '/Content/images/multichoice-question.png'
                },
                fillInTheBlank: {
                    type: 1,
                    image: '/Content/images/fillintheblank-question.png'
                },
                dragAndDrop: {
                    type: 2,
                    image: '/Content/images/draganddrop-question.png'
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
                    upgraded: 'user:upgraded'
                },
                course: {
                    created: 'course:created',
                    deleted: 'course:deleted',
                    titleUpdated: 'course:titleUpdated',
                    objectiveRelated: 'course:objectiveRelated',
                    objectivesUnrelated: 'course:objectivesUnrelated',
                    objectivesReordered: 'course:objectivesReordered',

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
                        collaboratorAdded: 'course:collaboration-collaboratorAdded',
                        started: 'course:collaboration-started'
                    }
                },
                objective: {
                    titleUpdated: 'objective:titleUpdated',
                    questionsReordered: 'objective:questionsReordered'
                },
                question: {
                    created: 'question:created',
                    deleted: 'questions:deleted',
                    titleUpdated: 'question:titleUpdated'
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
            }
        };
    }
);