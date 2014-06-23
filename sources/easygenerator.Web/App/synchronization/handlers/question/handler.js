define([
    'synchronization/handlers/question/eventHandlers/titleUpdated',
    'synchronization/handlers/question/eventHandlers/contentUpdated',
'synchronization/handlers/question/eventHandlers/created',
'synchronization/handlers/question/eventHandlers/deleted',
'synchronization/handlers/question/eventHandlers/fillInTheBlankUpdated',
'synchronization/handlers/question/eventHandlers/dragAndDrop/backgroundChanged',
'synchronization/handlers/question/eventHandlers/dragAndDrop/dropspotCreated',
'synchronization/handlers/question/eventHandlers/dragAndDrop/dropspotDeleted',
'synchronization/handlers/question/eventHandlers/dragAndDrop/dropspotTextChanged',
'synchronization/handlers/question/eventHandlers/dragAndDrop/dropspotPositionChanged'],
    function (titleUpdated,
        contentUpdated,
        created, deleted,
        fillInTheBlankUpdated,
        dragAndDropBackgroundChanged,
        dragAndDropDropspotCreated, 
        dragAndDropDropspotDeleted,
        dragAndDropDropspotTextChanged,
        dragAndDropDropspotPositionChanged) {
        "use strict";

        return {
            titleUpdated: titleUpdated,
            contentUpdated: contentUpdated,
            created: created,
            deleted: deleted,
            fillInTheBlankUpdated: fillInTheBlankUpdated,
            dragAndDropBackgroundChanged: dragAndDropBackgroundChanged,
            dragAndDropDropspotCreated: dragAndDropDropspotCreated,
            dragAndDropDropspotDeleted: dragAndDropDropspotDeleted,
            dragAndDropDropspotTextChanged: dragAndDropDropspotTextChanged,
            dragAndDropDropspotPositionChanged: dragAndDropDropspotPositionChanged,
        };

    });