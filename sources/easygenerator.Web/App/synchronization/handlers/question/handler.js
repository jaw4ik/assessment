define(['synchronization/handlers/question/eventHandlers/titleUpdated', 'synchronization/handlers/question/eventHandlers/contentUpdated',
'synchronization/handlers/question/eventHandlers/created', 'synchronization/handlers/question/eventHandlers/deleted'],
    function (titleUpdated, contentUpdated, created, deleted) {
        "use strict";

        return {
            titleUpdated: titleUpdated,
            contentUpdated: contentUpdated,
            created: created,
            deleted: deleted
        };

    });