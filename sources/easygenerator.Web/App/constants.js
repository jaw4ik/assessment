define([],
    function () {

        return {

            accessType: {
                free: '0',
                starter: '1'
            },

            sortingOptions: {
                byTitleAsc: 'byTitleAsc',
                byTitleDesc: 'byTitleDesc'
            },

            deliveringStates: {
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
                course: {
                    build: {
                        started: 'course:build-started',
                        completed: 'course:build-completed',
                        failed: 'course:build-failed',
                    },
                    scormBuild: {
                        started: 'course:scormBuild-started',
                        completed: 'course:scormBuild-completed',
                        failed: 'course:scormBuild-failed',
                    },
                    publish: {
                        started: 'course:publish-started',
                        completed: 'course:publish-completed',
                        failed: 'course:publish-failed'
                    },
                    publishToAim4You: {
                        started: 'course:publishToAim4You-started',
                        completed: 'course:publishToAim4You-comleted',
                        failed: 'course:publishToAim4You-failed'
                    },
                    action: {
                        started: 'course:action-started'
                    }
                }
            },

            defaultObjectiveImage: '/Content/images/objective.png'
        };
    }
);