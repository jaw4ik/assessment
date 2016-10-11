define(['synchronization/handlers/learningContent/eventHandlers/created', 'synchronization/handlers/learningContent/eventHandlers/updated', 'synchronization/handlers/learningContent/eventHandlers/deleted'],
    function (created, updated, deleted) {
        "use strict";

        return {
            created: created,
            updated: updated,
            deleted: deleted
        };

    });