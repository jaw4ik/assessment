define([
    'synchronization/handlers/question/eventHandlers/titleUpdated',
    'synchronization/handlers/question/eventHandlers/contentUpdated',
'synchronization/handlers/question/eventHandlers/created',
'synchronization/handlers/question/eventHandlers/deleted',
'synchronization/handlers/question/eventHandlers/fillInTheBlankUpdated',
'synchronization/handlers/question/eventHandlers/dragAndDrop/backgroundChanged'],
    function (titleUpdated, contentUpdated, created, deleted, fillInTheBlankUpdated, dragAndDropBackgroundChanged) {
        "use strict";

        return {
            titleUpdated: titleUpdated,
            contentUpdated: contentUpdated,
            created: created,
            deleted: deleted,
            fillInTheBlankUpdated: fillInTheBlankUpdated,
            dragAndDropBackgroundChanged: dragAndDropBackgroundChanged
        };

    });