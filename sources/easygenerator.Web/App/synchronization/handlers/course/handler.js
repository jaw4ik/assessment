define(['synchronization/handlers/course/eventHandlers/deleted', 'synchronization/handlers/course/eventHandlers/introductionContentUpdated',
    'synchronization/handlers/course/eventHandlers/objectiveRelated', 'synchronization/handlers/course/eventHandlers/objectivesReordered',
'synchronization/handlers/course/eventHandlers/objectivesUnrelated', 'synchronization/handlers/course/eventHandlers/published',
'synchronization/handlers/course/eventHandlers/templateUpdated', 'synchronization/handlers/course/eventHandlers/titleUpdated',
'synchronization/handlers/course/eventHandlers/objectivesReplaced', 'synchronization/handlers/course/eventHandlers/stateChanged'],
    function (deleted, introductionContentUpdated, objectiveRelated, objectivesReordered, objectivesUnrelated, published, templateUpdated, titleUpdated, objectivesReplaced, stateChanged) {
        "use strict";

        return {
            titleUpdated: titleUpdated,
            introductionContentUpdated: introductionContentUpdated,
            templateUpdated: templateUpdated,
            objectivesReordered: objectivesReordered,
            published: published,
            deleted: deleted,
            objectiveRelated: objectiveRelated,
            objectivesUnrelated: objectivesUnrelated,
            objectivesReplaced: objectivesReplaced,
            stateChanged: stateChanged
        };

    });