define(['synchronization/handlers/objective/eventHandlers/questionsReordered', 'synchronization/handlers/objective/eventHandlers/titleUpdated'],
    function (questionsReordered, titleUpdated) {
        "use strict";

        return {
            questionsReordered: questionsReordered,
            titleUpdated: titleUpdated
        };

    });