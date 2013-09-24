define([],
    function () {

        return {
            sortingOptions: {
                byTitleAsc: 'byTitleAsc',
                byTitleDesc: 'byTitleDesc'
            },

            buildingStatuses: {
                notStarted: 'notStarted',
                inProgress: 'inProgress',
                succeed: 'succeed',
                failed: 'failed'
            },
            
            autosaveTimersInterval: {
                answerOption: 60000,
                learningObject: 60000,
                questionTitle: 5000
            },
            
            validation: {
                objectiveTitleMaxLength: 255,
                experienceTitleMaxLength: 255,
                questionTitleMaxLength: 255
            },
            
            defaultObjectiveImage: '/Content/images/objective.png'
        };
    }
);