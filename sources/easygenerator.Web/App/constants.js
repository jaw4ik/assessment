define([],
    function () {

        return {
            sortingOptions: {
                byTitleAsc: 'byTitleAsc',
                byTitleDesc: 'byTitleDesc'
            },

            deliveringStates: {
                notStarted: 'notStarted',
                building: 'building',
                publishing: 'publishing',
                succeed: 'succeed',
                failed: 'failed'
            },
            
            autosaveTimersInterval: {
                answerOption: 60000,
                learningContent: 60000,
                questionContent: 60000,
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
                    publish: {
                        started: 'course:publish-started',
                        completed: 'course:publish-completed',
                        failed: 'course:publish-failed'
                    }
                }
            },

            defaultObjectiveImage: '/Content/images/objective.png'
        };
    }
);