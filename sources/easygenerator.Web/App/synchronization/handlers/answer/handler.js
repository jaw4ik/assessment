define(['synchronization/handlers/answer/eventHandlers/created', 'synchronization/handlers/answer/eventHandlers/deleted', 'synchronization/handlers/answer/eventHandlers/textUpdated',
'synchronization/handlers/answer/eventHandlers/multipleSelectAnswerCorrectnessUpdated', 'synchronization/handlers/answer/eventHandlers/singleSelectAnswerCorrectnessUpdated'],
    function (created, deleted, textUpdated, multipleSelectAnswerCorrectnessUpdated, singleSelectAnswerCorrectnessUpdated) {
        "use strict";

        return {
            created: created,
            deleted: deleted,
            textUpdated: textUpdated,
            multipleSelectAnswerCorrectnessUpdated: multipleSelectAnswerCorrectnessUpdated,
            singleSelectAnswerCorrectnessUpdated: singleSelectAnswerCorrectnessUpdated
        };

    });