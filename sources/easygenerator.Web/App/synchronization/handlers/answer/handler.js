define(['synchronization/handlers/answer/eventHandlers/created', 'synchronization/handlers/answer/eventHandlers/deleted', 'synchronization/handlers/answer/eventHandlers/textUpdated',
'synchronization/handlers/answer/eventHandlers/answerCorrectnessUpdated'],
    function (created, deleted, textUpdated, answerCorrectnessUpdated) {
        "use strict";

        return {
            created: created,
            deleted: deleted,
            textUpdated: textUpdated,
            answerCorrectnessUpdated: answerCorrectnessUpdated
        };

    });