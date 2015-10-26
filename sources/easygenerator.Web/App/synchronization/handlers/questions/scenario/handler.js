define([
    'synchronization/handlers/questions/scenario/eventHandlers/dataUpdated',
    'synchronization/handlers/questions/scenario/eventHandlers/masteryScoreUpdated'],
    function (dataUpdated, masteryScoreUpdated) {
        "use strict";
        
        return {
            dataUpdated: dataUpdated,
            masteryScoreUpdated: masteryScoreUpdated
        };

    });