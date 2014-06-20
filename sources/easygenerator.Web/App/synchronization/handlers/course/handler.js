define(['synchronization/handlers/course/eventHandlers/collaborationStarted', 'synchronization/handlers/course/eventHandlers/collaboratorAdded',
    'synchronization/handlers/course/eventHandlers/collaboratorRegistered',
    'synchronization/handlers/course/eventHandlers/deleted', 'synchronization/handlers/course/eventHandlers/introductionContentUpdated',
    'synchronization/handlers/course/eventHandlers/objectiveRelated', 'synchronization/handlers/course/eventHandlers/objectivesReordered',
    'synchronization/handlers/course/eventHandlers/objectivesUnrelated', 'synchronization/handlers/course/eventHandlers/objectivesUnrelated',
    'synchronization/handlers/course/eventHandlers/templateUpdated', 'synchronization/handlers/course/eventHandlers/titleUpdated'],
    function (collaborationStarted, collaboratorAdded, collaboratorRegistered, deleted, introductionContentUpdated, objectiveRelated, objectivesReordered, objectivesUnrelated, published, templateUpdated, titleUpdated) {
        "use strict";

        return {
            collaborationStarted: collaborationStarted,
            collaboratorAdded: collaboratorAdded,
            collaboratorRegistered: collaboratorRegistered,
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