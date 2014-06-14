define(['synchronization/handlers/answer/eventHandlers/created', 'synchronization/handlers/answer/eventHandlers/deleted'],
    function (created, deleted) {
        "use strict";

        return {
            created: created,
            deleted: deleted
        };

    });