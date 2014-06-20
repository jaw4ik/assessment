define(['synchronization/handlers/course/eventHandlers/deleted', 'synchronization/handlers/course/eventHandlers/introductionContentUpdated',
    'synchronization/handlers/course/eventHandlers/objectiveRelated', 'synchronization/handlers/course/eventHandlers/objectivesReordered',
'synchronization/handlers/course/eventHandlers/objectivesUnrelated', 'synchronization/handlers/course/eventHandlers/objectivesUnrelated',
'synchronization/handlers/course/eventHandlers/templateUpdated', 'synchronization/handlers/course/eventHandlers/titleUpdated'],
    function ( deleted, introductionContentUpdated, objectiveRelated, objectivesReordered, objectivesUnrelated, published, templateUpdated, titleUpdated) {
        "use strict";

        return {
            titleUpdated: titleUpdated,
            introductionContentUpdated: introductionContentUpdated,
            templateUpdated: templateUpdated,
            objectivesReordered: objectivesReordered,
            published: published,
            deleted: deleted,
            objectiveRelated: objectiveRelated,
            objectivesUnrelated: objectivesUnrelated
        };

    });