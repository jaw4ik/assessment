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
            
            autosaveTimersDelay: {
                answerOption: 60000,
                explanation: 60000
            }
        };
    }
);