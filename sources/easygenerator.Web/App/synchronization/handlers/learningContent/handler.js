define(['synchronization/handlers/learningContent/eventHandlers/created', 'synchronization/handlers/learningContent/eventHandlers/textUpdated', 'synchronization/handlers/learningContent/eventHandlers/deleted'],
    function (created, textUpdated, deleted) {
        "use strict";

        return {
            created: created,
            textUpdated: textUpdated,
            deleted: deleted
        };

    });