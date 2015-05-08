define([
    'synchronization/handlers/objective/eventHandlers/questionsReordered',
    'synchronization/handlers/objective/eventHandlers/titleUpdated',
    'synchronization/handlers/objective/eventHandlers/imageUrlUpdated'
],
    function (questionsReordered, titleUpdated, imageUrlUpdated) {
        "use strict";

        return {
            questionsReordered: questionsReordered,
            titleUpdated: titleUpdated,
            imageUrlUpdated: imageUrlUpdated
        };

    }
);