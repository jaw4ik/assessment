define(['synchronization/handlers/answer/eventHandlers/created', 'synchronization/handlers/answer/eventHandlers/deleted', 'synchronization/handlers/answer/eventHandlers/textUpdated',
'synchronization/handlers/answer/eventHandlers/correctnessUpdated'],
    function (created, deleted, textUpdated, correctnessUpdated) {
        "use strict";

        return {
            created: created,
            deleted: deleted,
            textUpdated: textUpdated,
            correctnessUpdated: correctnessUpdated
        };

    });