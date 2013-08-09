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
                explanation: 60000,
                questionTitle: 5000
            }
        };
    }
);