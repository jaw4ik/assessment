define([],
    function () {

        return {
            sortingOptions: {
                byTitleAsc: 'byTitleAsc',
                byTitleDesc: 'byTitleDesc'
            },

            statuses: {
                notStarted: 'notStarted',
                inProgress: 'inProgress',
                succeed: 'succeed',
                failed: 'failed'
            },
            
            autosaveTimersInterval: {
                answerOption: 60000,
                learningContent: 60000,
                questionTitle: 5000
            },

            validation: {
                objectiveTitleMaxLength: 255,
                experienceTitleMaxLength: 255,
                questionTitleMaxLength: 255
            },

            messages: {
                experience: {
                    build: {
                        started: 'experience:build-started',
                        completed: 'experience:build-completed',
                        failed: 'experience:build-failed',
                    },
                    publish: {
                        started: 'experience:publish-started',
                        completed: 'experience:publish-completed',
                        failed: 'experience:publish-failed'
                    }
                }
            },

            defaultObjectiveImage: '/Content/images/objective.png'
        };
    }
);